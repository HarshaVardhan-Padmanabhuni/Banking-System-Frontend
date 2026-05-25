package com.accountservice.accountservice.services;

import com.accountservice.accountservice.clients.AuthClient;
import com.accountservice.accountservice.entity.Account;
import com.accountservice.accountservice.entity.FixedDeposit;
import com.accountservice.accountservice.entity.RecurringDeposit;
import com.accountservice.accountservice.exceptions.AccountNotFoundException;
import com.accountservice.accountservice.exceptions.AccountResourceException;
import com.accountservice.accountservice.exceptions.DepositNotFoundException;
import com.accountservice.accountservice.exceptions.InsufficientBalanceException;
import com.accountservice.accountservice.repositories.AccountRepository;
import com.accountservice.accountservice.repositories.FixedDepositRepository;
import com.accountservice.accountservice.repositories.RecurringDepositRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DepositService {

    private final AuthClient authClient;

    private final AccountRepository accountRepository;
    private final FixedDepositRepository fixedDepositRepository;
    private final RecurringDepositRepository recurringDepositRepository;

    public DepositService(AccountRepository accountRepository,
                          FixedDepositRepository fixedDepositRepository,
                          RecurringDepositRepository recurringDepositRepository,
                          AuthClient authClient) {

        this.accountRepository = accountRepository;
        this.fixedDepositRepository = fixedDepositRepository;
        this.recurringDepositRepository = recurringDepositRepository;
        this.authClient = authClient;
    }

    // ---------------- FIXED DEPOSIT ----------------

    @Transactional
    public FixedDeposit createFixedDepositWithPassword(
            Long accountId,
            Long userid,
            String password,
            FixedDeposit fd) {

        authClient.verifyOrThrow(userid, password);
        System.out.println("DEBUG START");

        System.out.println("AccountId: " + accountId);
        System.out.println("UserId: " + userid);
        System.out.println("Password: " + password);
        System.out.println("FD Object: " + fd);

        System.out.println("Principal: " + fd.getPrincipalamount());
        System.out.println("Interest: " + fd.getInterestrate());
        System.out.println("Tenure: " + fd.getTenuremonths());
        return createFixedDeposit(accountId, fd);
    }

    @Transactional
    public FixedDeposit createFixedDeposit(Long accountId, FixedDeposit fd) {

        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account not found"));

        BigDecimal principal =
                requirePositive(fd.getPrincipalamount(),
                        "Principal amount");

        ensureSufficientBalance(acc, principal);

        acc.setBalance(
                safe(acc.getBalance()).subtract(principal)
        );

        accountRepository.save(acc);

        if (fd.getStartdate() == null) {
            fd.setStartdate(LocalDate.now());
        }

        if (fd.getMaturitydate() == null &&
                fd.getTenuremonths() != null) {

            fd.setMaturitydate(
                    fd.getStartdate()
                            .plusMonths(fd.getTenuremonths())
            );
        }

        fd.setAccount(acc);

        return fixedDepositRepository.save(fd);
    }

    public List<FixedDeposit> getFixedDeposits(Long accountId) {

        return fixedDepositRepository
                .findByAccount_Accountid(accountId);
    }

    public FixedDeposit getFixedDeposit(Long fdId) {

        return fixedDepositRepository.findById(fdId)
                .orElseThrow(() ->
                        new DepositNotFoundException(
                                "Fixed deposit not found"
                        ));
    }

    @Transactional
    public FixedDeposit updateFixedDeposit(
            Long accountId,
            Long fdId,
            FixedDeposit updated
    ) {

        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Account not found"
                        ));

        FixedDeposit existing =
                fixedDepositRepository.findById(fdId)
                        .orElseThrow(() ->
                                new DepositNotFoundException(
                                        "Fixed deposit not found"
                                ));

        if (existing.getAccount() == null ||
                existing.getAccount().getAccountid() == null ||
                !existing.getAccount()
                        .getAccountid()
                        .equals(accountId)) {

            throw new AccountResourceException(
                    "This FD does not belong to the given account"
            );
        }

        BigDecimal oldPrincipal =
                safe(existing.getPrincipalamount());

        BigDecimal newPrincipal =
                (updated.getPrincipalamount() != null)
                        ? requirePositive(
                        updated.getPrincipalamount(),
                        "Principal amount"
                )
                        : oldPrincipal;

        BigDecimal diff =
                newPrincipal.subtract(oldPrincipal);

        if (diff.compareTo(BigDecimal.ZERO) > 0) {

            ensureSufficientBalance(acc, diff);

            acc.setBalance(
                    safe(acc.getBalance()).subtract(diff)
            );

        } else if (diff.compareTo(BigDecimal.ZERO) < 0) {

            acc.setBalance(
                    safe(acc.getBalance()).add(diff.abs())
            );
        }

        accountRepository.save(acc);

        if (updated.getPrincipalamount() != null)
            existing.setPrincipalamount(
                    updated.getPrincipalamount()
            );

        if (updated.getInterestrate() != null)
            existing.setInterestrate(
                    updated.getInterestrate()
            );

        if (updated.getTenuremonths() != null)
            existing.setTenuremonths(
                    updated.getTenuremonths()
            );

        if (updated.getMaturityamount() != null)
            existing.setMaturityamount(
                    updated.getMaturityamount()
            );

        if (updated.getStartdate() != null)
            existing.setStartdate(
                    updated.getStartdate()
            );

        if (updated.getMaturitydate() != null)
            existing.setMaturitydate(
                    updated.getMaturitydate()
            );

        if (updated.getStatus() != null)
            existing.setStatus(
                    updated.getStatus()
            );

        return fixedDepositRepository.save(existing);
    }

    // ---------------- RECURRING DEPOSIT ----------------

    @Transactional
    public RecurringDeposit createRecurringDepositWithPassword(
            Long accountId,
            Long userid,
            String password,
            RecurringDeposit rd) {

        authClient.verifyOrThrow(userid, password);

        return createRecurringDeposit(accountId, rd);
    }

    @Transactional
    public RecurringDeposit createRecurringDeposit(
            Long accountId,
            RecurringDeposit rd
    ) {

        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Account not found"
                        ));

        BigDecimal monthly =
                requirePositive(
                        rd.getMonthlyamount(),
                        "Monthly amount"
                );

        ensureSufficientBalance(acc, monthly);

        acc.setBalance(
                safe(acc.getBalance()).subtract(monthly)
        );

        accountRepository.save(acc);

        LocalDate start =
                (rd.getStartdate() != null)
                        ? rd.getStartdate()
                        : LocalDate.now();

        rd.setPaidmonths(1);
        rd.setLastpaiddate(start);
        rd.setNextduedate(start.plusMonths(1));

        rd.setAccount(acc);

        return recurringDepositRepository.save(rd);
    }

    public List<RecurringDeposit> getRecurringDeposits(
            Long accountId
    ) {

        return recurringDepositRepository
                .findByAccount_Accountid(accountId);
    }

    public RecurringDeposit getRecurringDeposit(Long rdId) {

        return recurringDepositRepository.findById(rdId)
                .orElseThrow(() ->
                        new DepositNotFoundException(
                                "Recurring deposit not found"
                        ));
    }

    @Transactional
    public RecurringDeposit updateRecurringDeposit(
            Long accountId,
            Long rdId,
            RecurringDeposit updated
    ) {

        RecurringDeposit existing =
                recurringDepositRepository.findById(rdId)
                        .orElseThrow(() ->
                                new DepositNotFoundException(
                                        "Recurring deposit not found"
                                ));

        if (existing.getAccount() == null ||
                existing.getAccount().getAccountid() == null ||
                !existing.getAccount()
                        .getAccountid()
                        .equals(accountId)) {

            throw new AccountResourceException(
                    "This RD does not belong to the given account"
            );
        }

        if (updated.getMonthlyamount() != null) {

            existing.setMonthlyamount(
                    requirePositive(
                            updated.getMonthlyamount(),
                            "Monthly amount"
                    )
            );
        }

        if (updated.getInterestrate() != null)
            existing.setInterestrate(
                    updated.getInterestrate()
            );

        if (updated.getTenuremonths() != null)
            existing.setTenuremonths(
                    updated.getTenuremonths()
            );

        if (updated.getStartdate() != null)
            existing.setStartdate(
                    updated.getStartdate()
            );

        if (updated.getMaturitydate() != null)
            existing.setMaturitydate(
                    updated.getMaturitydate()
            );

        if (updated.getStatus() != null)
            existing.setStatus(
                    updated.getStatus()
            );

        return recurringDepositRepository.save(existing);
    }

    @Transactional
    public RecurringDeposit payRecurringInstallment(
            Long rdId
    ) {

        RecurringDeposit rd =
                recurringDepositRepository.findById(rdId)
                        .orElseThrow(() ->
                                new DepositNotFoundException(
                                        "Recurring deposit not found"
                                ));

        Account acc = rd.getAccount();

        if (acc == null || acc.getAccountid() == null) {

            throw new AccountNotFoundException(
                    "Account not found"
            );
        }

        BigDecimal monthly =
                requirePositive(
                        rd.getMonthlyamount(),
                        "Monthly amount"
                );

        ensureSufficientBalance(acc, monthly);

        acc.setBalance(
                safe(acc.getBalance()).subtract(monthly)
        );

        accountRepository.save(acc);

        LocalDate today = LocalDate.now();

        int paid =
                (rd.getPaidmonths() == null)
                        ? 0
                        : rd.getPaidmonths();

        rd.setPaidmonths(paid + 1);
        rd.setLastpaiddate(today);
        rd.setNextduedate(today.plusMonths(1));

        return recurringDepositRepository.save(rd);
    }

    // ---------------- helpers ----------------

    private BigDecimal safe(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private BigDecimal requirePositive(
            BigDecimal v,
            String field
    ) {

        if (v == null ||
                v.compareTo(BigDecimal.ZERO) <= 0) {

            throw new AccountResourceException(
                    field + " must be greater than 0"
            );
        }

        return v;
    }

    private void ensureSufficientBalance(
            Account acc,
            BigDecimal amount
    ) {

        if (safe(acc.getBalance())
                .compareTo(amount) < 0) {

            throw new InsufficientBalanceException(
                    "Insufficient balance"
            );
        }
    }
}