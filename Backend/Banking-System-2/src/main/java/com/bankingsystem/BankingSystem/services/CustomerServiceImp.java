package com.bankingsystem.BankingSystem.services;





import com.bankingsystem.BankingSystem.entity.Customer;
import com.bankingsystem.BankingSystem.entity.CustomerStatus;
import com.bankingsystem.BankingSystem.entity.KycStatus;

import java.util.List;

public interface CustomerServiceImp {

    // Customer CRUD
    Customer registerCustomer(Customer customer); // creates customer + default CustomerStatus(false)
    Customer getCustomerById(Long customerId);
    Customer getCustomerByUserId(Long userId);
    Customer getCustomerByEmail(String email);
    Customer getCustomerByPhone(String phone);
    List<Customer> getAllCustomers();
    Customer updateCustomer(Long customerId, Customer updated);
    void deleteCustomer(Long customerId);

    // Customer status management (Employee actions)
    CustomerStatus getCustomerStatus(Long customerId);
    CustomerStatus activateCustomer(Long customerId, String remarks);
    CustomerStatus deactivateCustomer(Long customerId, String remarks);

    // KYC management
    Customer updateKycStatus(Long customerId, KycStatus status);

    // Convenience checks
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByUserId(Long userId);
}