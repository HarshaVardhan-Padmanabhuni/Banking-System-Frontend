package com.transactionservice.transactionservice.repositories;

import com.transactionservice.transactionservice.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
