package com.transactionservice.transactionservice.controllers;

import com.transactionservice.transactionservice.dto.AmountRequest;
import com.transactionservice.transactionservice.dto.StatementItem;
import com.transactionservice.transactionservice.dto.TransferRequest;
import com.transactionservice.transactionservice.entity.*;
import com.transactionservice.transactionservice.services.TransactionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // --------------------
    // CRUD APIs
    // --------------------

    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getOneTransaction(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.save(transaction));
    }

    @PutMapping("/update")
    public ResponseEntity<Transaction> updateTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.updateTransaction(transaction));
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<Transaction> partialUpdate(
            @PathVariable Long id,
            @RequestBody Transaction transaction
    ) {
        return ResponseEntity.ok(transactionService.partialUpdate(id, transaction));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok().body(
                java.util.Map.of("message", "Transaction deleted successfully")
        );
    }

    // --------------------
    // BANKING OPERATIONS
    // --------------------

    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestBody AmountRequest req) {
        return ResponseEntity.ok(
                transactionService.deposit(req.getAccountId(), req.getAmount())
        );
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestBody AmountRequest req) {
        return ResponseEntity.ok(
                transactionService.withdraw(req.getAccountId(), req.getAmount())
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<Transfer> transfer(@RequestBody TransferRequest req) {
        return ResponseEntity.ok(
                transactionService.transfer(
                        req.getFromAccountId(),
                        req.getToAccountId(),
                        req.getAmount()
                )
        );
    }

    @GetMapping("/statement")
    public ResponseEntity<List<StatementItem>> getStatement(
            @RequestParam Long accountId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to
    ) {
        return ResponseEntity.ok(
                transactionService.getStatement(accountId, from, to)
        );
    }
}
