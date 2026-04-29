package com.transactionservice.transactionservice.repositories;

import java.time.LocalDateTime;
import com.transactionservice.transactionservice.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Long> {

    @Query("""
    SELECT t FROM Transfer t
    WHERE (t.fromAccount.accountid = :accountId
        OR t.toAccount.accountid = :accountId)
    AND t.txntimestamp BETWEEN :from AND :to
""")
    List<Transfer> findByAccountInEitherSide(
            @Param("accountId") Long accountId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
