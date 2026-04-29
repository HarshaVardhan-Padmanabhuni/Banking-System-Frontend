package com.accountservice.accountservice.controllers;



import com.accountservice.accountservice.services.DepositService;
import com.accountservice.accountservice.entity.FixedDeposit;
import com.accountservice.accountservice.entity.RecurringDeposit;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deposits")
public class DepositController {

    private DepositService depositService;

    public DepositController(DepositService depositService) {
        this.depositService = depositService;
    }

    // ✅ Create Fixed Deposit
    @PostMapping("/fixed/{accountId}")
    public FixedDeposit createFixedDeposit(@PathVariable Long accountId,
                                           @RequestBody FixedDeposit fd) {
        return depositService.createFixedDeposit(accountId, fd);
    }

    // ✅ Get Fixed Deposits by account
    @GetMapping("/fixed/account/{accountId}")
    public List<FixedDeposit> getFixedDeposits(@PathVariable Long accountId) {
        return depositService.getFixedDeposits(accountId);
    }

    // ✅ Get Fixed Deposit by fdId
    @GetMapping("/fixed/{fdId}")
    public FixedDeposit getFixedDeposit(@PathVariable Long fdId) {
        return depositService.getFixedDeposit(fdId);
    }

    // ✅ Create Recurring Deposit
    @PostMapping("/recurring/{accountId}")
    public RecurringDeposit createRecurringDeposit(@PathVariable Long accountId,
                                                   @RequestBody RecurringDeposit rd) {
        return depositService.createRecurringDeposit(accountId, rd);
    }

    // ✅ Get Recurring Deposits by account
    @GetMapping("/recurring/account/{accountId}")
    public List<RecurringDeposit> getRecurringDeposits(@PathVariable Long accountId) {
        return depositService.getRecurringDeposits(accountId);
    }

    // ✅ Get Recurring Deposit by rdId
    @GetMapping("/recurring/{rdId}")
    public RecurringDeposit getRecurringDeposit(@PathVariable Long rdId) {
        return depositService.getRecurringDeposit(rdId);
    }
}