package com.accountservice.accountservice.services;


import com.accountservice.accountservice.exceptions.AccountNotFoundException;
import com.accountservice.accountservice.exceptions.DepositNotFoundException;
import com.accountservice.accountservice.repositories.AccountRepository;
import com.accountservice.accountservice.repositories.FixedDepositRepository;
import com.accountservice.accountservice.repositories.RecurringDepositRepository;
import com.accountservice.accountservice.entity.Account;
import com.accountservice.accountservice.entity.FixedDeposit;
import com.accountservice.accountservice.entity.RecurringDeposit;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepositService {

    private AccountRepository accountRepository;
    private FixedDepositRepository fixedDepositRepository;
    private RecurringDepositRepository recurringDepositRepository;

    public DepositService(AccountRepository accountRepository,
                          FixedDepositRepository fixedDepositRepository,
                          RecurringDepositRepository recurringDepositRepository) {
        this.accountRepository = accountRepository;
        this.fixedDepositRepository = fixedDepositRepository;
        this.recurringDepositRepository = recurringDepositRepository;
    }

    public FixedDeposit createFixedDeposit(Long accountId, FixedDeposit fd) {
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account not found"));
        fd.setAccount(acc);
        return fixedDepositRepository.save(fd);
    }

    public List<FixedDeposit> getFixedDeposits(Long accountId) {
        return fixedDepositRepository.findByAccount_Accountid(accountId);
    }

    public FixedDeposit getFixedDeposit(Long fdId) {
        return fixedDepositRepository.findById(fdId)
                .orElseThrow(() ->
                        new DepositNotFoundException("Fixed deposit not found"));
    }

    public RecurringDeposit createRecurringDeposit(Long accountId, RecurringDeposit rd) {
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account not found"));
        rd.setAccount(acc);
        return recurringDepositRepository.save(rd);
    }

    public List<RecurringDeposit> getRecurringDeposits(Long accountId) {
        return recurringDepositRepository.findByAccount_Accountid(accountId);
    }

    public RecurringDeposit getRecurringDeposit(Long rdId) {
        return recurringDepositRepository.findById(rdId)
                .orElseThrow(() ->
                        new DepositNotFoundException("Recurring deposit not found"));
    }
}