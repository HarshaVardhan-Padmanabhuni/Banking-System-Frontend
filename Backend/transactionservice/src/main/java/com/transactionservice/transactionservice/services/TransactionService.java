package com.transactionservice.transactionservice.services;

import com.transactionservice.transactionservice.dto.StatementItem;
import com.transactionservice.transactionservice.entity.*;
import com.transactionservice.transactionservice.exceptions.*;
import com.transactionservice.transactionservice.repositories.AccountRepository;
import com.transactionservice.transactionservice.repositories.TransactionRepository;
import com.transactionservice.transactionservice.repositories.TransferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private TransactionRepository transactionRepository;
    private TransferRepository transferRepository;
    private AccountRepository accountRepository;

    // ✅ Constructor Injection (EmpService template)
    public TransactionService(TransactionRepository transactionRepository,
                              TransferRepository transferRepository,
                              AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.transferRepository = transferRepository;
        this.accountRepository = accountRepository;
    }

    // =========================
    // CRUD: Transactions
    // =========================

    public List<Transaction> getAllTransactions() {
        return this.transactionRepository.findAll();
    }

    public Transaction getOneTransaction(Long id) {
        Optional<Transaction> txnOp = transactionRepository.findById(id);
        if (txnOp.isPresent()) {
            return txnOp.get();
        } else {
            throw new TransactionNotFoundException("Transaction with id " + id + " not found");
        }
    }

    public Transaction save(Transaction t) {
        if (t.getTxnid() != null && transactionRepository.existsById(t.getTxnid())) {
            throw new RuntimeException("Transaction already exists in database");
        } else {
            return transactionRepository.save(t);
        }
    }

    public Transaction updateTransaction(Transaction t) {
        if (t.getTxnid() == null || !transactionRepository.existsById(t.getTxnid())) {
            throw new TransactionNotFoundException("Transaction not found");
        } else {
            return transactionRepository.save(t);
        }
    }

    public void deleteTransaction(Long id) {
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
        } else {
            throw new TransactionNotFoundException("Transaction with id " + id + " not found");
        }
    }

    public Transaction partialUpdate(Long id, Transaction partialTxn) {
        Transaction targetTxn = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

        if (partialTxn.getTxntype() != null) {
            targetTxn.setTxntype(partialTxn.getTxntype());
        }
        if (partialTxn.getAmount() != null) {
            targetTxn.setAmount(partialTxn.getAmount());
        }
        if (partialTxn.getStatus() != null) {
            targetTxn.setStatus(partialTxn.getStatus());
        }
        if (partialTxn.getAccount() != null) {
            targetTxn.setAccount(partialTxn.getAccount());
        }

        return transactionRepository.save(targetTxn);
    }

    // =========================
    // Required: Deposit / Withdraw / Transfer / Statement
    // =========================

    @Transactional
    public Transaction deposit(Long accountId, BigDecimal amount) {
        validateAmount(amount);

        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found"));

        validateAccountActive(acc);

        acc.setBalance(acc.getBalance().add(amount));
        accountRepository.save(acc);

        Transaction txn = new Transaction(acc, TransactionType.DEPOSIT, amount);
        txn.setStatus(TransactionStatus.SUCCESS);
        return transactionRepository.save(txn);
    }

    @Transactional
    public Transaction withdraw(Long accountId, BigDecimal amount) {
        validateAmount(amount);

        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found"));

        validateAccountActive(acc);

        if (acc.getBalance().compareTo(amount) < 0) {
            Transaction failedTxn = new Transaction(acc, TransactionType.WITHDRAW, amount);
            failedTxn.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(failedTxn);
            throw new InsufficientBalanceException("Insufficient balance");
        }

        acc.setBalance(acc.getBalance().subtract(amount));
        accountRepository.save(acc);

        Transaction txn = new Transaction(acc, TransactionType.WITHDRAW, amount
















        );
        txn.setStatus(TransactionStatus.SUCCESS);
        return transactionRepository.save(txn);
    }

    @Transactional
    public Transfer transfer(Long fromAccountId, Long toAccountId, BigDecimal amount) {
        validateAmount(amount);

        if (fromAccountId.equals(toAccountId)) {
            throw new RuntimeException("fromAccountId and toAccountId cannot be same");
        }

        Account fromAcc = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new AccountNotFoundException("From account not found"));

        Account toAcc = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new AccountNotFoundException("To account not found"));

        validateAccountActive(fromAcc);
        validateAccountActive(toAcc);

        if (fromAcc.getBalance().compareTo(amount) < 0) {
            Transfer failedTransfer = new Transfer(fromAcc, toAcc, amount);
            failedTransfer.setStatus(TransferStatus.FAILED);
            transferRepository.save(failedTransfer);

            Transaction failedTxn = new Transaction(fromAcc, TransactionType.TRANSFER, amount);
            failedTxn.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(failedTxn);

            throw new InsufficientBalanceException("Insufficient balance for transfer");
        }

        fromAcc.setBalance(fromAcc.getBalance().subtract(amount));
        toAcc.setBalance(toAcc.getBalance().add(amount));
        accountRepository.save(fromAcc);
        accountRepository.save(toAcc);

        Transfer tr = new Transfer(fromAcc, toAcc, amount);
        tr.setStatus(TransferStatus.SUCCESS);
        Transfer savedTransfer = transferRepository.save(tr);

        Transaction debitTxn = new Transaction(fromAcc, TransactionType.TRANSFER, amount);
        debitTxn.setStatus(TransactionStatus.SUCCESS);
        transactionRepository.save(debitTxn);

        Transaction creditTxn = new Transaction(toAcc, TransactionType.TRANSFER, amount);
        creditTxn.setStatus(TransactionStatus.SUCCESS);
        transactionRepository.save(creditTxn);

        return savedTransfer;
    }

    public List<StatementItem> getStatement(Long accountId, LocalDateTime from, LocalDateTime to) {

        List<Transaction> txns = transactionRepository
                .findByAccount_AccountidAndTxntimestampBetween(accountId, from, to);

        List<Transfer> transfers = transferRepository
                .findByAccountInEitherSide(accountId, from, to);

        List<StatementItem> result = new ArrayList<>();

        // map transactions
        for(Transaction t: txns){
            StatementItem item = new StatementItem();
            item.setTimestamp(t.getTxntimestamp());
            item.setType(t.getTxntype().name());
            item.setStatus(t.getStatus().name());
            item.setRefId(t.getTxnid());

            if(t.getTxntype() == TransactionType.DEPOSIT){
                item.setCredit(t.getAmount());
                item.setDebit(BigDecimal.ZERO);
                item.setDescription("Deposit");
            } else if(t.getTxntype() == TransactionType.WITHDRAW){
                item.setCredit(BigDecimal.ZERO);
                item.setDebit(t.getAmount());
                item.setDescription("Withdraw");
            } else {
                // if you keep TRANSFER here, you'll still not have to/from info
                item.setDescription("Transfer");
            }
            result.add(item);
        }

        // map transfers
        for (Transfer tr : transfers) {

            StatementItem item = new StatementItem();
            item.setTimestamp(tr.getTxntimestamp()); // ✅ FIXED
            item.setType("TRANSFER");
            item.setStatus(tr.getStatus().name());
            item.setRefId(tr.getTransferid());

            if (tr.getFromAccount().getAccountid().equals(accountId)) {
                item.setDebit(tr.getAmount());
                item.setCredit(BigDecimal.ZERO);
                item.setDescription("Transfer to A/C " + tr.getToAccount().getAccountid());
            } else {
                item.setCredit(tr.getAmount());
                item.setDebit(BigDecimal.ZERO);
                item.setDescription("Transfer from A/C " + tr.getFromAccount().getAccountid());
            }

            result.add(item);
        }
        // sort by timestamp
        result.sort(Comparator.comparing(StatementItem::getTimestamp));

        return result;
    }

    // =========================
    // Helpers
    // =========================

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
