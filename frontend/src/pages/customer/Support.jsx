<<<<<<< HEAD
export default function Support() {
    return (
        <>
            <div className="container mt-5 pt-5 w-50">
                <h2>Support</h2>
                <p>Feature coming soon...</p>
            </div>
        </>
    );
}
=======
import React, { useState } from "react";
import ChatbotPanel from "../../support-chat/ChatbotPanel";
import "bootstrap/dist/css/bootstrap.min.css";
 
const faqs = [
  { question: "How do I open a new account?", answer: "To open a new account, log in to your dashboard, navigate to 'Open Account', select the account type, and follow the prompts to provide necessary details and submit." },
  { question: "What documents are required to open an account?", answer: "You need a valid ID proof, address proof, and sometimes income proof depending on the account type. Check the 'Open Account' page for specifics." },
  { question: "How can I check my account balance?", answer: "Log in to your dashboard and view the balance on the main screen. You can also check statements for detailed transaction history." },
  { question: "How do I transfer money to another account?", answer: "Go to the 'Transfer' section in your dashboard, enter the recipient's details, amount, and confirm the transaction." },
  { question: "Are there any fees for transfers?", answer: "Intra-bank transfers are free. Inter-bank transfers may incur a small fee depending on the amount and frequency." },
  { question: "How do I apply for a credit card?", answer: "Navigate to the 'Cards' page in your dashboard and select 'Apply for Credit Card'. Fill in the application form and submit." },
  { question: "What is the interest rate on savings accounts?", answer: "Interest rates vary; check the current rates on the 'Deposits' page or contact support for the latest information." },
  { question: "How do I view my transaction statements?", answer: "Go to the 'Statements' page in your dashboard to view and download your transaction history." },
  { question: "How can I update my profile information?", answer: "Visit the 'Profile' page, edit your details, and save the changes." },
  { question: "What should I do if I forget my password?", answer: "Use the 'Forgot Password' link on the login page to reset your password via email." },
  { question: "How do I deposit money into my account?", answer: "Use the 'Deposits' page to initiate a deposit. Follow the instructions for online or branch deposits." },
  { question: "Can I withdraw money online?", answer: "Online withdrawals are not supported. Visit a branch or use an ATM for withdrawals." },
  { question: "How do I apply for a fixed deposit?", answer: "Go to the 'Fixed Deposit' page, select the term and amount, and submit the application." },
  { question: "What is a recurring deposit?", answer: "A recurring deposit allows you to save a fixed amount monthly. Apply via the 'Recurring Deposit' page." },
  { question: "How do I pay bills online?", answer: "Use the 'Bills' page to add billers and make payments directly from your account." },
  { question: "Is my account information secure?", answer: "Yes, we use advanced encryption and security measures to protect your data." },
  { question: "How do I contact customer support?", answer: "You can reach us via the 'Support' page or call our helpline for assistance." },
  { question: "What are the bank’s operating hours?", answer: "Branches operate from 9 AM to 5 PM, Monday to Saturday. Online services are available 24/7." },
  { question: "How do I close my account?", answer: "Contact support or visit a branch to initiate account closure. Ensure all balances are cleared." },
  { question: "Are there any minimum balance requirements?", answer: "Yes, savings accounts require a minimum balance. Check account details for specifics." },
];
 
export default function Support() {
  const [openIndex, setOpenIndex] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
 
  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);
 
  return (
    <div className="container mt-5 pt-5 w-75">
      <h2 className="text-center mb-4">Frequently Asked Questions</h2>
 
      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className={`accordion-button ${openIndex === index ? "" : "collapsed"}`}
                type="button"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`collapse${index}`}
              >
                {faq.question}
              </button>
            </h2>
 
            <div
              id={`collapse${index}`}
              className={`accordion-collapse collapse ${openIndex === index ? "show" : ""}`}
              aria-labelledby={`heading${index}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>

      {/* floating Chat Button */}
      <button
        className="btn btn-primary rounded-pill shadow"
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
        onClick={() => setChatOpen(true)}
      >
        💬 Chat Support
      </button>

      {/*  Chatbot Panel */}
      <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
 
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
