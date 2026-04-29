
package com.bankingsystem.BankingSystem.services;

import com.bankingsystem.BankingSystem.entity.Customer;
import com.bankingsystem.BankingSystem.entity.CustomerStatus;
import com.bankingsystem.BankingSystem.entity.KycStatus;
import com.bankingsystem.BankingSystem.exceptions.ResourceNotFoundException;
import com.bankingsystem.BankingSystem.repositories.CustomerRepository;
import com.bankingsystem.BankingSystem.repositories.CustomerStatusRepository;
import com.bankingsystem.BankingSystem.services.CustomerServiceImp;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerServices implements CustomerServiceImp {

    private final CustomerRepository customerRepository;
    private final CustomerStatusRepository customerStatusRepository;

    public CustomerServices(CustomerRepository customerRepository,
                               CustomerStatusRepository customerStatusRepository) {
        this.customerRepository = customerRepository;
        this.customerStatusRepository = customerStatusRepository;
    }

    // -------------------- Customer CRUD --------------------

    @Override
    public Customer registerCustomer(Customer customer) {
        // customer must have user, fullname, email, phone (based on entity constraints)
        Customer saved = customerRepository.save(customer);

        // Create default status for new customer (accountactive=false)
        // Your CustomerStatus constructor sets accountactive=false. [2](https://insightgloballlc-my.sharepoint.com/personal/kasaboina_lithin_insightglobal_com/Documents/Microsoft%20Copilot%20Chat%20Files/CustomerStatus.java)
        CustomerStatus status = customerStatusRepository.findByCustomer_Customerid(saved.getCustomerid())
                .orElseGet(() -> new CustomerStatus(saved));

        status.setRemarks("Registered - pending activation");
        customerStatusRepository.save(status);

        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public Customer getCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
    }

    @Override
    @Transactional(readOnly = true)
    public Customer getCustomerByUserId(Long userId) {
        return customerRepository.findByUser_Userid(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with userId: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
    }

    @Override
    @Transactional(readOnly = true)
    public Customer getCustomerByPhone(String phone) {
        return customerRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with phone: " + phone));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return this.customerRepository.findAll();
    }

    @Override
    public Customer updateCustomer(Long customerId, Customer updated) {
        Customer existing = getCustomerById(customerId);

        // Update only allowed fields
        if (updated.getFullname() != null) existing.setFullname(updated.getFullname());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getPhone() != null) existing.setPhone(updated.getPhone());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());

        // KYC update is separated as its own method, but you can allow here too if needed:
        // if (updated.getKycstatus() != null) existing.setKycstatus(updated.getKycstatus());

        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(Long customerId) {
        Customer existing = getCustomerById(customerId);

        // optional: delete status first (if cascade not configured)
        customerStatusRepository.findByCustomer_Customerid(customerId)
                .ifPresent(customerStatusRepository::delete);

        customerRepository.delete(existing);
    }

    // -------------------- Customer Status Management --------------------

    @Override
    @Transactional(readOnly = true)
    public CustomerStatus getCustomerStatus(Long customerId) {
        // ensure customer exists
        Customer customer = getCustomerById(customerId);

        return customerStatusRepository.findByCustomer_Customerid(customer.getCustomerid())
                .orElseThrow(() -> new ResourceNotFoundException("CustomerStatus not found for customerId: " + customerId));
    }

    @Override
    public CustomerStatus activateCustomer(Long customerId, String remarks) {
        Customer customer = getCustomerById(customerId);

        CustomerStatus status = customerStatusRepository.findByCustomer_Customerid(customer.getCustomerid())
                .orElseGet(() -> new CustomerStatus(customer));

        status.setAccountactive(true);
        status.setRemarks(remarks != null ? remarks : "Activated");
        return customerStatusRepository.save(status);
    }

    @Override
    public CustomerStatus deactivateCustomer(Long customerId, String remarks) {
        Customer customer = getCustomerById(customerId);

        CustomerStatus status = customerStatusRepository.findByCustomer_Customerid(customer.getCustomerid())
                .orElseGet(() -> new CustomerStatus(customer));

        status.setAccountactive(false);
        status.setRemarks(remarks != null ? remarks : "Deactivated");
        return customerStatusRepository.save(status);
    }

    // -------------------- KYC Management --------------------

    @Override
    public Customer updateKycStatus(Long customerId, KycStatus status) {
        Customer customer = getCustomerById(customerId);
        customer.setKycstatus(status); // Customer has kycstatus enum default PENDING [1](https://insightgloballlc-my.sharepoint.com/personal/kasaboina_lithin_insightglobal_com/Documents/Microsoft%20Copilot%20Chat%20Files/Customer.java)[5](https://insightgloballlc-my.sharepoint.com/personal/kasaboina_lithin_insightglobal_com/Documents/Microsoft%20Copilot%20Chat%20Files/KycStatus.java)
        return customerRepository.save(customer);
    }

    // -------------------- Existence checks --------------------

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return customerRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return customerRepository.existsByPhone(phone);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUserId(Long userId) {
        return customerRepository.existsByUser_Userid(userId);
    }
}