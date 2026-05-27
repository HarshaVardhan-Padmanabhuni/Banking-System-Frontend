package com.transactionservice.transactionservice;

import com.transactionservice.transactionservice.dto.StatementItem;
import com.transactionservice.transactionservice.entity.*;
        import com.transactionservice.transactionservice.exceptions.*;
        import com.transactionservice.transactionservice.repositories.AccountRepository;
import com.transactionservice.transactionservice.repositories.TransactionRepository;
import com.transactionservice.transactionservice.repositories.TransferRepository;
import com.transactionservice.transactionservice.services.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

        import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransferRepository transferRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Account activeA1;
    private Account activeA2;

    @BeforeEach
    void setUp() {
        activeA1 = activeAccount(1L, "A1", "1000");
        activeA2 = activeAccount(2L, "A2", "500");
    }

    // ----------------------------
    // Helpers
    // ----------------------------

    private static Account activeAccount(Long id, String number, String balance) {
        Account a = new Account();
        a.setAccountid(id);
        a.setAccountnumber(number);
        a.setBalance(new BigDecimal(balance));
        a.setStatus(AccountStatus.ACTIVE);
        return a;
    }

    private static Account inactiveAccount(Long id, String number, String balance) {
        Account a = new Account();
        a.setAccountid(id);
        a.setAccountnumber(number);
        a.setBalance(new BigDecimal(balance));
        a.setStatus(AccountStatus.INACTIVE);
        return a;
    }


    // ==========================================================
    // CRUD: Transactions
    // ==========================================================

    @Test
    void getAllTransactions_returnsList() {
        when(transactionRepository.findAll()).thenReturn(List.of(new Transaction(), new Transaction()));

        List<Transaction> result = transactionService.getAllTransactions();

        assertEquals(2, result.size());
        verify(transactionRepository).findAll();
    }

    @Test
    void getOneTransaction_found_returnsTxn() {
        Transaction t = new Transaction();
        t.setTxnid(10L);
        when(transactionRepository.findById(10L)).thenReturn(Optional.of(t));

        Transaction result = transactionService.getOneTransaction(10L);

        assertEquals(10L, result.getTxnid());
    }

    @Test
    void getOneTransaction_notFound_throws() {
        when(transactionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(TransactionNotFoundException.class,
                () -> transactionService.getOneTransaction(99L));
    }

    @Test
    void save_whenIdExistsInDb_throwsRuntime() {
        Transaction t = new Transaction();
        t.setTxnid(5L);
        when(transactionRepository.existsById(5L)).thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> transactionService.save(t));

        verify(transactionRepository, never()).save(any());
    }

    @Test
    void save_whenNew_savesAndReturns() {
        Transaction t = new Transaction(); // txnid null => allowed
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transaction result = transactionService.save(t);

        assertNotNull(result);
        verify(transactionRepository).save(t);
    }

    @Test
    void updateTransaction_whenMissingId_throwsNotFound() {
        Transaction t = new Transaction(); // txnid null

        assertThrows(TransactionNotFoundException.class,
                () -> transactionService.updateTransaction(t));

        verify(transactionRepository, never()).save(any());
    }

    @Test
    void updateTransaction_whenIdNotExists_throwsNotFound() {
        Transaction t = new Transaction();
        t.setTxnid(7L);
        when(transactionRepository.existsById(7L)).thenReturn(false);

        assertThrows(TransactionNotFoundException.class,
                () -> transactionService.updateTransaction(t));

        verify(transactionRepository, never()).save(any());
    }

    @Test
    void updateTransaction_whenExists_saves() {
        Transaction t = new Transaction();
        t.setTxnid(7L);
        when(transactionRepository.existsById(7L)).thenReturn(true);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transaction result = transactionService.updateTransaction(t);

        assertNotNull(result);
        verify(transactionRepository).save(t);
    }

    @Test
    void deleteTransaction_whenExists_deletes() {
        when(transactionRepository.existsById(1L)).thenReturn(true);

        transactionService.deleteTransaction(1L);

        verify(transactionRepository).deleteById(1L);
    }

    @Test
    void deleteTransaction_whenMissing_throws() {
        when(transactionRepository.existsById(1L)).thenReturn(false);

        assertThrows(TransactionNotFoundException.class,
                () -> transactionService.deleteTransaction(1L));

        verify(transactionRepository, never()).deleteById(anyLong());
    }

    @Test
    void partialUpdate_notFound_throws() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.empty());
        Transaction partial = new Transaction();

        assertThrows(TransactionNotFoundException.class,
                () -> transactionService.partialUpdate(1L, partial));
    }

    @Test
    void partialUpdate_updatesOnlyNonNullFields() {
        Transaction existing = new Transaction();
        existing.setTxnid(1L);
        existing.setTxntype(TransactionType.DEPOSIT);
        existing.setAmount(new BigDecimal("10"));
        existing.setStatus(TransactionStatus.SUCCESS);
        existing.setAccount(activeA1);

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transaction partial = new Transaction();
        partial.setTxntype(TransactionType.WITHDRAW);
        partial.setAmount(new BigDecimal("50"));
        // leave status null to keep old
        // change account
        partial.setAccount(activeA2);

        Transaction result = transactionService.partialUpdate(1L, partial);

        assertEquals(TransactionType.WITHDRAW, result.getTxntype());
        assertEquals(new BigDecimal("50"), result.getAmount());
        assertEquals(TransactionStatus.SUCCESS, result.getStatus()); // unchanged
        assertEquals(activeA2, result.getAccount());
    }

    // ==========================================================
    // Deposit (by Id & by Number) + validations
    // ==========================================================

    @Test
    void deposit_byId_success() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(activeA1));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transaction txn = transactionService.deposit(1L, new BigDecimal("200"));

        assertEquals(TransactionType.DEPOSIT, txn.getTxntype());
        assertEquals(TransactionStatus.SUCCESS, txn.getStatus());
        assertEquals(new BigDecimal("1200"), activeA1.getBalance());
    }

    @Test
    void deposit_byNumber_success() {
        when(accountRepository.findByAccountnumber("A1")).thenReturn(Optional.of(activeA1));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transaction txn = transactionService.deposit("A1", new BigDecimal("100"));

        assertEquals(TransactionType.DEPOSIT, txn.getTxntype());
        assertEquals(new BigDecimal("1100"), activeA1.getBalance());
    }

    @Test
    void deposit_invalidAmount_throws() {

        //  ensure account exists
        when(accountRepository.findById(1L))
                .thenReturn(Optional.of(activeA1));

        assertThrows(InvalidAmountException.class,
                () -> transactionService.deposit(1L, BigDecimal.ZERO));

        verify(accountRepository, never()).save(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void deposit_accountIdNull_throws() {

        BigDecimal amount = new BigDecimal("10"); // ✅ moved outside

        assertThrows(RuntimeException.class,
                () -> transactionService.deposit((Long) null, amount));
    }

    @Test
    void deposit_accountNotFound_throws() {

        when(accountRepository.findById(9L))
                .thenReturn(Optional.empty());

        BigDecimal amount = new BigDecimal("10");

        assertThrows(AccountNotFoundException.class,
                () -> transactionService.deposit(9L, amount));
    }

    @Test
    void deposit_accountInactive_throws() {

        Account inactive = inactiveAccount(3L, "X", "100");
        when(accountRepository.findById(3L)).thenReturn(Optional.of(inactive));

        BigDecimal amount = new BigDecimal("10");

        assertThrows(AccountInactiveException.class,
                () -> transactionService.deposit(3L, amount));
    }

    // ==========================================================
    // Withdraw (by Id & by Number) + validations + insufficient balance
    // ==========================================================

    @Test
    void withdraw_byId_success() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(activeA1));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transaction txn = transactionService.withdraw(1L, new BigDecimal("300"));

        assertEquals(TransactionType.WITHDRAW, txn.getTxntype());
        assertEquals(TransactionStatus.SUCCESS, txn.getStatus());
        assertEquals(new BigDecimal("700"), activeA1.getBalance());
    }

    @Test
    void withdraw_byNumber_success() {
        when(accountRepository.findByAccountnumber("A1")).thenReturn(Optional.of(activeA1));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transaction txn = transactionService.withdraw("A1", new BigDecimal("100"));

        assertEquals(TransactionType.WITHDRAW, txn.getTxntype());
        assertEquals(new BigDecimal("900"), activeA1.getBalance());
    }

    @Test
    void withdraw_invalidAmount_throws() {

        // ensure account exists
        when(accountRepository.findById(1L))
                .thenReturn(Optional.of(activeA1));

        BigDecimal amount = new BigDecimal("-1");

        assertThrows(InvalidAmountException.class,
                () -> transactionService.withdraw(1L, amount));

        verify(accountRepository, never()).save(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void withdraw_accountInactive_throws() {

        Account inactive = inactiveAccount(3L, "X", "100");
        when(accountRepository.findById(3L)).thenReturn(Optional.of(inactive));

        BigDecimal amount = new BigDecimal("10");

        assertThrows(AccountInactiveException.class,
                () -> transactionService.withdraw(3L, amount));
    }


    @Test
    void withdraw_insufficientBalance_savesFailedTxn_thenThrows() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(activeA1));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        BigDecimal tooMuch = new BigDecimal("99999");

        assertThrows(InsufficientBalanceException.class,
                () -> transactionService.withdraw(1L, tooMuch));

        // should save a FAILED transaction before throwing
        ArgumentCaptor<Transaction> txnCap = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository).save(txnCap.capture());
        assertEquals(TransactionStatus.FAILED, txnCap.getValue().getStatus());
        assertEquals(TransactionType.WITHDRAW, txnCap.getValue().getTxntype());
    }

    // ==========================================================
    // Transfer (ID path)
    // ==========================================================

    @Test
    void transfer_byId_nullIds_throws() {

        BigDecimal amount = new BigDecimal("10");

        assertThrows(InvalidTransferException.class,
                () -> transactionService.transfer(null, 2L, amount));
    }


    @Test
    void transfer_byId_sameId_throws() {

        BigDecimal amount = new BigDecimal("10");

        assertThrows(InvalidTransferException.class,
                () -> transactionService.transfer(1L, 1L, amount));
    }


    @Test
    void transfer_byId_invalidAmount_throws() {

        BigDecimal amount = BigDecimal.ZERO;

        assertThrows(InvalidAmountException.class,
                () -> transactionService.transfer(1L, 2L, amount));
    }

    @Test
    void transfer_byId_accountNotFound_throws() {

        when(accountRepository.findById(1L)).thenReturn(Optional.empty());

        BigDecimal amount = new BigDecimal("10");

        assertThrows(AccountNotFoundException.class,
                () -> transactionService.transfer(1L, 2L, amount));
    }

    @Test
    void transfer_byId_inactiveAccount_throws() {

        Account inactive = inactiveAccount(1L, "A1", "1000");

        when(accountRepository.findById(1L)).thenReturn(Optional.of(inactive));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(activeA2));

        BigDecimal amount = new BigDecimal("10");

        assertThrows(AccountInactiveException.class,
                () -> transactionService.transfer(1L, 2L, amount));
    }


    @Test
    void transfer_byId_insufficientBalance_savesFailedTransferAndFailedTxn_thenThrows() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(activeA1));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(activeA2));
        when(transferRepository.save(any(Transfer.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        BigDecimal tooMuch = new BigDecimal("99999");

        assertThrows(InsufficientBalanceException.class,
                () -> transactionService.transfer(1L, 2L, tooMuch));

        ArgumentCaptor<Transfer> trCap = ArgumentCaptor.forClass(Transfer.class);
        verify(transferRepository).save(trCap.capture());
        assertEquals(TransferStatus.FAILED, trCap.getValue().getStatus());

        // one FAILED txn saved for transfer attempt (debit side)
        ArgumentCaptor<Transaction> txnCap = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository, atLeastOnce()).save(txnCap.capture());
        assertTrue(txnCap.getAllValues().stream().anyMatch(t -> t.getStatus() == TransactionStatus.FAILED));
    }

    @Test
    void transfer_byId_success_updatesBalances_savesTransfer_andTwoTxns() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(activeA1));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(activeA2));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transferRepository.save(any(Transfer.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transfer tr = transactionService.transfer(1L, 2L, new BigDecimal("200"));

        assertEquals(TransferStatus.SUCCESS, tr.getStatus());
        assertEquals(new BigDecimal("800"), activeA1.getBalance());
        assertEquals(new BigDecimal("700"), activeA2.getBalance());

        // should save accounts twice
        verify(accountRepository, times(2)).save(any(Account.class));
        // should save transfer once
        verify(transferRepository, times(1)).save(any(Transfer.class));
        // should save 2 txns on success (debit+credit)
        verify(transactionRepository, times(2)).save(any(Transaction.class));
    }

    // ==========================================================
    // Transfer (Number path)
    // ==========================================================

    @Test
    void transfer_byNumber_blankNumbers_throwsRuntime() {

        BigDecimal amount = new BigDecimal("10");

        assertThrows(RuntimeException.class,
                () -> transactionService.transfer(" ", "A2", amount));
    }


    @Test
    void transfer_byNumber_sameNumber_throwsRuntime() {

        BigDecimal amount = new BigDecimal("10");

        assertThrows(RuntimeException.class,
                () -> transactionService.transfer("A1", "A1", amount));
    }

    @Test
    void transfer_byNumber_accountNotFound_throws() {

        when(accountRepository.findByAccountnumber("A1"))
                .thenReturn(Optional.empty());

        BigDecimal amount = new BigDecimal("10");

        assertThrows(AccountNotFoundException.class,
                () -> transactionService.transfer("A1", "A2", amount));
    }

    // ==========================================================
    // Statement building (accountId & accountNumber + transfer debit/credit side)
    // ==========================================================

    @Test
    void getStatementByAccountId_buildsDepositAndWithdrawItems() {

        LocalDateTime from = LocalDateTime.now().minusDays(2);
        LocalDateTime to = LocalDateTime.now();

        // Mock DEPOSIT txn with non-null timestamp
        Transaction dep = mock(Transaction.class);
        when(dep.getTxntimestamp()).thenReturn(from.plusHours(1));
        when(dep.getTxntype()).thenReturn(TransactionType.DEPOSIT);
        when(dep.getStatus()).thenReturn(TransactionStatus.SUCCESS);
        when(dep.getTxnid()).thenReturn(1L);
        when(dep.getAmount()).thenReturn(new BigDecimal("100"));

        //  Mock WITHDRAW txn with non-null timestamp
        Transaction wit = mock(Transaction.class);
        when(wit.getTxntimestamp()).thenReturn(from.plusHours(2));
        when(wit.getTxntype()).thenReturn(TransactionType.WITHDRAW);
        when(wit.getStatus()).thenReturn(TransactionStatus.SUCCESS);
        when(wit.getTxnid()).thenReturn(2L);
        when(wit.getAmount()).thenReturn(new BigDecimal("50"));

        // service will fetch txns + transfers
        when(transactionRepository.findByAccount_AccountidAndTxntimestampBetween(1L, from, to))
                .thenReturn(List.of(dep, wit));

        // keep transfers empty for this test (simpler)
        when(transferRepository.findByAccountInEitherSide(1L, from, to))
                .thenReturn(List.of());

        List<StatementItem> items = transactionService.getStatementByAccountId(1L, from, to);

        assertEquals(2, items.size());
        assertEquals("DEPOSIT", items.get(0).getType());
        assertEquals("WITHDRAW", items.get(1).getType());
    }


    @Test
    void getStatementByAccountNumber_transferDebitSideAndCreditSideDescriptions() {

        LocalDateTime from = LocalDateTime.now().minusDays(2);
        LocalDateTime to = LocalDateTime.now();

        // real accounts so getAccountnumber/getAccountid never null
        Account a1 = new Account();
        a1.setAccountid(1L);
        a1.setAccountnumber("A1");

        Account a2 = new Account();
        a2.setAccountid(2L);
        a2.setAccountnumber("A2");

        //  Transfer where A1 is FROM => debit-side for accountNumber="A1"
        Transfer trDebit = mock(Transfer.class);
        when(trDebit.getTxntimestamp()).thenReturn(from.plusHours(1));
        when(trDebit.getStatus()).thenReturn(TransferStatus.SUCCESS);
        when(trDebit.getTransferid()).thenReturn(100L);
        when(trDebit.getAmount()).thenReturn(new BigDecimal("10"));
        when(trDebit.getFromAccount()).thenReturn(a1);
        when(trDebit.getToAccount()).thenReturn(a2);

        //  Transfer where A1 is TO => credit-side for accountNumber="A1"
        Transfer trCredit = mock(Transfer.class);
        when(trCredit.getTxntimestamp()).thenReturn(from.plusHours(2));
        when(trCredit.getStatus()).thenReturn(TransferStatus.SUCCESS);
        when(trCredit.getTransferid()).thenReturn(200L);
        when(trCredit.getAmount()).thenReturn(new BigDecimal("20"));
        when(trCredit.getFromAccount()).thenReturn(a2);
        when(trCredit.getToAccount()).thenReturn(a1);

        // txns list empty, transfers list contains both directions
        when(transactionRepository.findByAccount_AccountnumberAndTxntimestampBetween("A1", from, to))
                .thenReturn(List.of());

        when(transferRepository.findByAccountNumberInEitherSide("A1", from, to))
                .thenReturn(List.of(trDebit, trCredit));

        List<StatementItem> items = transactionService.getStatementByAccountNumber("A1", from, to);

        assertEquals(2, items.size());

        // Ensure both debit & credit descriptions exist
        boolean hasTo = items.stream().anyMatch(i -> "Transfer to A/C A2".equals(i.getDescription()));
        boolean hasFrom = items.stream().anyMatch(i -> "Transfer from A/C A2".equals(i.getDescription()));

        assertTrue(hasTo);
        assertTrue(hasFrom);
    }

    @Test
    void save_transactionAlreadyExists_throws() {

        Transaction t = new Transaction();
        t.setTxnid(1L);

        when(transactionRepository.existsById(1L)).thenReturn(true);

        assertThrows(TransactionAlreadyExistsException.class,
                () -> transactionService.save(t));

        verify(transactionRepository, never()).save(any());
    }
}