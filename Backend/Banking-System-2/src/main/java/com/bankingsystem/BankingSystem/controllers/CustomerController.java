package com.bankingsystem.BankingSystem.controllers;

import com.bankingsystem.BankingSystem.entity.Customer;
import com.bankingsystem.BankingSystem.entity.CustomerStatus;
import com.bankingsystem.BankingSystem.entity.KycStatus;
import com.bankingsystem.BankingSystem.services.CustomerServiceImp;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerServiceImp customerService;

    public CustomerController(CustomerServiceImp customerService) {
        this.customerService = customerService;
    }

    // -------------------- Customer CRUD --------------------

    // Register customer (creates customer + default CustomerStatus)
    @PostMapping("/register")
    public ResponseEntity<Customer> registerCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.registerCustomer(customer));
    }

    // Get customer by customerId
    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getCustomerById(customerId));
    }

    // Get customer by userId (auth userId reference)
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Customer> getCustomerByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(customerService.getCustomerByUserId(userId));
    }

    // Get by email
    @GetMapping("/by-email")
    public ResponseEntity<Customer> getCustomerByEmail(@RequestParam String email) {
        return ResponseEntity.ok(customerService.getCustomerByEmail(email));
    }

    // Get by phone
    @GetMapping("/by-phone")
    public ResponseEntity<Customer> getCustomerByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(customerService.getCustomerByPhone(phone));
    }

    // Get all customers (employee use-case)
    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    // Update customer profile fields
    @PutMapping("/update/{customerId}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long customerId,
                                                   @RequestBody Customer updated) {
        return ResponseEntity.ok(customerService.updateCustomer(customerId, updated));
    }

    // Delete customer
    @DeleteMapping("/delete/{customerId}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Customer deleted"));
    }

    // -------------------- Customer Status Management --------------------

    // Get customer status
    @GetMapping("/{customerId}/status")
    public ResponseEntity<CustomerStatus> getCustomerStatus(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getCustomerStatus(customerId));
    }

    // Activate customer (employee action)
    @PutMapping("/{customerId}/status/activate")
    public ResponseEntity<CustomerStatus> activateCustomer(@PathVariable Long customerId,
                                                           @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(customerService.activateCustomer(customerId, remarks));
    }

    // Deactivate customer (employee action)
    @PutMapping("/{customerId}/status/deactivate")
    public ResponseEntity<CustomerStatus> deactivateCustomer(@PathVariable Long customerId,
                                                             @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(customerService.deactivateCustomer(customerId, remarks));
    }

    // -------------------- KYC Management --------------------

    // Update KYC status (employee action)
    @PutMapping("/{customerId}/kyc")
    public ResponseEntity<Customer> updateKycStatus(@PathVariable Long customerId,
                                                    @RequestParam KycStatus status) {
        return ResponseEntity.ok(customerService.updateKycStatus(customerId, status));
    }

    // -------------------- Convenience Checks --------------------

    @GetMapping("/exists/email")
    public ResponseEntity<?> existsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(java.util.Map.of("exists", customerService.existsByEmail(email)));
    }

    @GetMapping("/exists/phone")
    public ResponseEntity<?> existsByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(java.util.Map.of("exists", customerService.existsByPhone(phone)));
    }

    @GetMapping("/exists/user")
    public ResponseEntity<?> existsByUserId(@RequestParam Long userId) {
        return ResponseEntity.ok(java.util.Map.of("exists", customerService.existsByUserId(userId)));
    }
}
