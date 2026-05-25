package com.accountservice.accountservice.dto;

import com.accountservice.accountservice.entity.FixedDeposit;
import com.accountservice.accountservice.entity.RecurringDeposit;

public class SecureDepositRequest {

    private Long userId;
    private String password;

    private FixedDeposit fd;
    private RecurringDeposit rd;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public FixedDeposit getFd() { return fd; }
    public void setFd(FixedDeposit fd) { this.fd = fd; }

    public RecurringDeposit getRd() { return rd; }
    public void setRd(RecurringDeposit rd) { this.rd = rd; }
}