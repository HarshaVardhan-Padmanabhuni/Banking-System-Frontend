package com.transactionservice.transactionservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.transactionservice.transactionservice.entity.Transaction;
import com.transactionservice.transactionservice.entity.Transfer;
import com.transactionservice.transactionservice.services.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class TransactionControllerTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    TransactionService transactionService;

    // --------------------
    // CRUD APIs
    // --------------------

    @Test
    void testGetAllTransactions_success() throws Exception {
        when(transactionService.getAllTransactions()).thenReturn(List.of(new Transaction()));

        mvc.perform(get("/api/transactions/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(transactionService).getAllTransactions();
    }

    @Test
    void testGetTransaction_success() throws Exception {
        when(transactionService.getOneTransaction(1L)).thenReturn(new Transaction());

        mvc.perform(get("/api/transactions/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(transactionService).getOneTransaction(1L);
    }

    @Test
    void testCreateTransaction_success() throws Exception {
        Transaction txn = new Transaction();
        when(transactionService.save(any(Transaction.class))).thenReturn(txn);

        mvc.perform(post("/api/transactions/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(txn)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(transactionService).save(any(Transaction.class));
    }

    @Test
    void testUpdateTransaction_success() throws Exception {
        Transaction txn = new Transaction();
        when(transactionService.updateTransaction(any(Transaction.class))).thenReturn(txn);

        mvc.perform(put("/api/transactions/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(txn)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(transactionService).updateTransaction(any(Transaction.class));
    }

    @Test
    void testPartialUpdate_success() throws Exception {

        Transaction txn = new Transaction();

        when(transactionService.partialUpdate(eq(1L), any(Transaction.class)))
                .thenReturn(txn);


        mvc.perform(patch("/api/transactions/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(txn)))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteTransaction_success() throws Exception {
        doNothing().when(transactionService).deleteTransaction(1L);

        mvc.perform(delete("/api/transactions/delete/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Transaction deleted successfully"));

        verify(transactionService).deleteTransaction(1L);
    }

    // --------------------
    // BANKING OPERATIONS
    // --------------------

    // ---- Deposit ----

    @Test
    void testDeposit_withAccountNumber_branch() throws Exception {
        when(transactionService.deposit(anyString(), any(BigDecimal.class)))
                .thenReturn(new Transaction());

        // accountNumber present => number-branch
        String body = """
                {"accountNumber":"ACC123","amount":1000}
                """;

        mvc.perform(post("/api/transactions/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        verify(transactionService).deposit("ACC123",new BigDecimal("1000"));
    }

    @Test
    void testDeposit_withAccountId_branch() throws Exception {
        when(transactionService.deposit(anyLong(), any(BigDecimal.class)))
                .thenReturn(new Transaction());

        // accountNumber missing/blank => id-branch
        String body = """
                {"accountId":10,"amount":500}
                """;

        mvc.perform(post("/api/transactions/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        verify(transactionService).deposit(10L,new BigDecimal("500"));
    }

    // ---- Withdraw ----


    @Test
    void testWithdraw_withAccountId_branch() throws Exception {
        when(transactionService.withdraw(anyLong(), any(BigDecimal.class)))
                .thenReturn(new Transaction());

        String body = """
                {"accountId":22,"amount":300}
                """;

        mvc.perform(post("/api/transactions/withdraw")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        verify(transactionService).withdraw(22L,new BigDecimal("300"));
    }

    // ---- Transfer ----

    @Test
    void testTransfer_withAccountNumbers_branch() throws Exception {
        when(transactionService.transfer(anyString(), anyString(), any(BigDecimal.class)))
                .thenReturn(new Transfer());

        String body = """
                {"fromAccountNumber":"A1","toAccountNumber":"A2","amount":100}
                """;

        mvc.perform(post("/api/transactions/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        verify(transactionService).transfer("A1","A2",new BigDecimal("100"));
    }

    @Test
    void testTransfer_withAccountIds_branch() throws Exception {
        when(transactionService.transfer(anyLong(), anyLong(), any(BigDecimal.class)))
                .thenReturn(new Transfer());

        // numbers missing => id-to-id branch
        String body = """
                {"fromAccountId":1,"toAccountId":2,"amount":250}
                """;

        mvc.perform(post("/api/transactions/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        verify(transactionService).transfer(1L, 2L, new BigDecimal("250"));
    }

    // ---- Statement ----

    @Test
    void testGetStatement_withAccountNumber_branch() throws Exception {
        when(transactionService.getStatementByAccountNumber(anyString(), any(), any()))
                .thenReturn(List.of());

        mvc.perform(get("/api/transactions/statement")
                        .param("accountNumber", "ACC1")
                        .param("from", "2024-01-01T00:00:00")
                        .param("to", "2024-01-02T00:00:00"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(transactionService).getStatementByAccountNumber(eq("ACC1"), any(), any());
        verify(transactionService, never()).getStatementByAccountId(any(), any(), any());
    }

    @Test
    void testGetStatement_withAccountId_branch() throws Exception {
        when(transactionService.getStatementByAccountId(anyLong(), any(), any()))
                .thenReturn(List.of());

        // accountNumber missing => id branch
        mvc.perform(get("/api/transactions/statement")
                        .param("accountId", "5")
                        .param("from", "2024-01-01T00:00:00")
                        .param("to", "2024-01-02T00:00:00"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(transactionService).getStatementByAccountId(eq(5L), any(), any());
        verify(transactionService, never()).getStatementByAccountNumber(anyString(), any(), any());
    }
}