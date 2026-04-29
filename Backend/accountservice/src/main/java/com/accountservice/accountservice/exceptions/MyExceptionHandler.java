

package com.accountservice.accountservice.exceptions;

import com.accountservice.accountservice.utils.ResponseMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MyExceptionHandler {

    @ExceptionHandler(AccountResourceException.class)
    public ResponseEntity<ResponseMessage> handle(AccountResourceException e) {
        return ResponseEntity
                .status(400)
                .body(new ResponseMessage(e.getMessage()));
    }
}

