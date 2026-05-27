package com.accountservice.accountservice.repositories;

import com.accountservice.accountservice.entity.DepositStatus;
import com.accountservice.accountservice.entity.RecurringDeposit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RecurringDepositRepository extends JpaRepository<RecurringDeposit, Long> {
    List<RecurringDeposit> findByAccount_Accountid(Long accountid);

    // ✅ NEW: due installments
    List<RecurringDeposit> findByStatusAndNextduedateLessThanEqual(DepositStatus status, LocalDate date);
}
