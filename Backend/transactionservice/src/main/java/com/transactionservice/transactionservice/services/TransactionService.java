package com.transactionservice.transactionservice.services;

import com.transactionservice.transactionservice.dto.StatementItem;
import com.transactionservice.transactionservice.dto.TransferRequest;
import com.transactionservice.transactionservice.dto.VerifyPasswordRequest;
import com.transactionservice.transactionservice.dto.VerifyPasswordResponse;
import com.transactionservice.transactionservice.entity.*;
import com.transactionservice.transactionservice.exceptions.*;
import com.transactionservice.transactionservice.repositories.AccountRepository;
import com.transactionservice.transactionservice.repositories.TransactionRepository;
import com.transactionservice.transactionservice.repositories.TransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TransactionService {

    @Autowired
    private RestTemplate restTemplate;

    private final TransactionRepository transactionRepository;
    private final TransferRepository transferRepository;
    private final AccountRepository accountRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              TransferRepository transferRepository,
                              AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.transferRepository = transferRepository;
        this.accountRepository = accountRepository;
    }

    // =========================
    // ✅ PASSWORD VERIFICATION
    // =========================
    private void verifyPassword(Long userId, String password) {

        String url = "http://authservice/auth/verify-password";

        VerifyPasswordRequest verifyReq = new VerifyPasswordRequest();
        verifyReq.setUserId(userId);
        verifyReq.setPassword(password);

        VerifyPasswordResponse response =
                restTemplate.postForObject(url, verifyReq, VerifyPasswordResponse.class);

        if (response == null || !response.isValid()) {
            throw new RuntimeException("Invalid password");
        }
    }

    // =========================
    // ✅ SECURE TRANSFER (ENTRY POINT)
    // =========================
    @Transactional
    public Transfer secureTransfer(TransferRequest req) {

        // ✅ Step 1: Verify password
        verifyPassword(req.getUserId(), req.getPassword());

        // ✅ Step 2: Route to existing logic
        if (req.getFromAccountNumber() != null &&
                req.getToAccountNumber() != null &&
                !req.getFromAccountNumber().isBlank() &&
                !req.getToAccountNumber().isBlank()) {

            return transfer(
                    req.getFromAccountNumber(),
                    req.getToAccountNumber(),
                    req.getAmount()
            );
        }

        return transfer(
                req.getFromAccountId(),
                req.getToAccountId(),
                req.getAmount()
        );
    }

    // =========================
    // CRUD: Transactions
    // =========================

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getOneTransaction(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction with id " + id + " not found"));
    }

    public Transaction save(Transaction t) {
        if (t.getTxnid() != null && transactionRepository.existsById(t.getTxnid())) {
            throw new TransactionAlreadyExistsException("Transaction already exists in database");
        }
        return transactionRepository.save(t);
    }

    public Transaction updateTransaction(Transaction t) {
        if (t.getTxnid() == null || !transactionRepository.existsById(t.getTxnid())) {
            throw new TransactionNotFoundException("Transaction not found");
        }
        return transactionRepository.save(t);
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new TransactionNotFoundException("Transaction not found");
        }
        transactionRepository.deleteById(id);
    }

    public Transaction partialUpdate(Long id, Transaction partialTxn) {
        Transaction targetTxn = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

        if (partialTxn.getTxntype() != null) targetTxn.setTxntype(partialTxn.getTxntype());
        if (partialTxn.getAmount() != null) targetTxn.setAmount(partialTxn.getAmount());
        if (partialTxn.getStatus() != null) targetTxn.setStatus(partialTxn.getStatus());
        if (partialTxn.getAccount() != null) targetTxn.setAccount(partialTxn.getAccount());

        return transactionRepository.save(targetTxn);
    }

    // =========================
    // Deposit / Withdraw
    // =========================

    @Transactional
    public Transaction deposit(Long accountId, BigDecimal amount) {
        return deposit(resolveAccountById(accountId), amount);
    }

    @Transactional
    public Transaction deposit(String accountNumber, BigDecimal amount) {
        return deposit(resolveAccountByNumber(accountNumber), amount);
    }

    private Transaction deposit(Account acc, BigDecimal amount) {
        validateAmount(amount);
        validateAccountActive(acc);

        acc.setBalance(acc.getBalance().add(amount));
        accountRepository.save(acc);

        Transaction txn = new Transaction(acc, TransactionType.DEPOSIT, amount);
        txn.setStatus(TransactionStatus.SUCCESS);
        return transactionRepository.save(txn);
    }

    @Transactional
    public Transaction withdraw(Long accountId, BigDecimal amount) {
        return withdraw(resolveAccountById(accountId), amount);
    }

    @Transactional
    public Transaction withdraw(String accountNumber, BigDecimal amount) {
        return withdraw(resolveAccountByNumber(accountNumber), amount);
    }

    private Transaction withdraw(Account acc, BigDecimal amount) {
        validateAmount(amount);
        validateAccountActive(acc);

        if (acc.getBalance().compareTo(amount) < 0) {
            Transaction failedTxn = new Transaction(acc, TransactionType.WITHDRAW, amount);
            failedTxn.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(failedTxn);
            throw new InsufficientBalanceException("Insufficient balance");
        }

        acc.setBalance(acc.getBalance().subtract(amount));
        accountRepository.save(acc);

        Transaction txn = new Transaction(acc, TransactionType.WITHDRAW, amount);
        txn.setStatus(TransactionStatus.SUCCESS);
        return transactionRepository.save(txn);
    }

    // =========================
    // Transfer (UNCHANGED LOGIC)
    // =========================

    @Transactional
    public Transfer transfer(Long fromAccountId, Long toAccountId, BigDecimal amount) {

        validateAmount(amount);

        if (fromAccountId == null || toAccountId == null) {
            throw new InvalidTransferException("fromAccountId and toAccountId are required");
        }
        if (fromAccountId.equals(toAccountId)) {
            throw new InvalidTransferException("Accounts cannot be same");
        }

        Account fromAcc = resolveAccountById(fromAccountId);
        Account toAcc = resolveAccountById(toAccountId);

        return doTransfer(fromAcc, toAcc, amount);
    }

    @Transactional
    public Transfer transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount) {

        validateAmount(amount);

        if (fromAccountNumber == null || toAccountNumber == null) {
            throw new InvalidTransferException("Account numbers required");
        }

        Account fromAcc = resolveAccountByNumber(fromAccountNumber);
        Account toAcc = resolveAccountByNumber(toAccountNumber);

        return doTransfer(fromAcc, toAcc, amount);
    }

    private Transfer doTransfer(Account fromAcc, Account toAcc, BigDecimal amount) {

        validateAccountActive(fromAcc);
        validateAccountActive(toAcc);

        if (fromAcc.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        fromAcc.setBalance(fromAcc.getBalance().subtract(amount));
        toAcc.setBalance(toAcc.getBalance().add(amount));

        accountRepository.save(fromAcc);
        accountRepository.save(toAcc);

        Transfer tr = new Transfer(fromAcc, toAcc, amount);
        tr.setStatus(TransferStatus.SUCCESS);

        return transferRepository.save(tr);
    }

    // =========================
    // ✅ STATEMENT (UNCHANGED)
    // =========================

    public List<StatementItem> getStatementByAccountId(Long accountId, LocalDateTime from, LocalDateTime to) {

        List<Transaction> txns = transactionRepository
                .findByAccount_AccountidAndTxntimestampBetween(accountId, from, to);

        List<Transfer> transfers = transferRepository
                .findByAccountInEitherSide(accountId, from, to);

        return buildStatement(accountId, null, txns, transfers);
    }

    public List<StatementItem> getStatementByAccountNumber(String accountNumber, LocalDateTime from, LocalDateTime to) {

        List<Transaction> txns = transactionRepository
                .findByAccount_AccountnumberAndTxntimestampBetween(accountNumber, from, to);

        List<Transfer> transfers = transferRepository
                .findByAccountNumberInEitherSide(accountNumber, from, to);

        return buildStatement(null, accountNumber, txns, transfers);
    }

    private List<StatementItem> buildStatement(Long accountId, String accountNumber,
                                               List<Transaction> txns, List<Transfer> transfers) {

        List<StatementItem> result = new ArrayList<>();

        for (Transaction t : txns) {
            StatementItem item = new StatementItem();
            item.setTimestamp(t.getTxntimestamp());
            item.setType(t.getTxntype().name());
            item.setStatus(t.getStatus().name());
            item.setRefId(t.getTxnid());

            if (t.getTxntype() == TransactionType.DEPOSIT) {
                item.setCredit(t.getAmount());
                item.setDebit(BigDecimal.ZERO);
                item.setDescription("Deposit");
            } else if (t.getTxntype() == TransactionType.WITHDRAW) {
                item.setDebit(t.getAmount());
                item.setCredit(BigDecimal.ZERO);
                item.setDescription("Withdraw");
            } else {
                item.setDescription("Transfer");
            }

            result.add(item);
        }

        for (Transfer tr : transfers) {
            StatementItem item = new StatementItem();
            item.setTimestamp(tr.getTxntimestamp());
            item.setType("TRANSFER");
            item.setStatus(tr.getStatus().name());
            item.setRefId(tr.getTransferid());

            String fromNo = tr.getFromAccount().getAccountnumber();
            String toNo = tr.getToAccount().getAccountnumber();

            boolean isDebit = (accountNumber != null)
                    ? fromNo.equals(accountNumber)
                    : tr.getFromAccount().getAccountid().equals(accountId);

            if (isDebit) {
                item.setDebit(tr.getAmount());
                item.setCredit(BigDecimal.ZERO);
                item.setDescription("Transfer to A/C " + toNo);
            } else {
                item.setCredit(tr.getAmount());
                item.setDebit(BigDecimal.ZERO);
                item.setDescription("Transfer from A/C " + fromNo);
            }

            result.add(item);
        }


        result.sort(
                Comparator.comparing(
                        StatementItem::getTimestamp,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ).reversed()
        );

        return result;
    }

    // =========================
    // Helpers
    // =========================

    private Account resolveAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
    }

    private Account resolveAccountByNumber(String number) {
        return accountRepository.findByAccountnumber(number)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Amount must be greater than 0");
        }
    }

    private void validateAccountActive(Account acc) {
        if (acc.getStatus() == null || acc.getStatus() == AccountStatus.INACTIVE) {
            throw new AccountInactiveException("Account is INACTIVE");
        }
    }
}