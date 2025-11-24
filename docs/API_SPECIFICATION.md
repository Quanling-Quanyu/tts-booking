# TTS Booking System - API Specification

## Overview
Complete REST API for TeamTogether Booking System
Total Endpoints: 21 | Authentication: JWT | Base: /api/v1

## 1. User Management

### 1.1 User Registration
POST /auth/register
No authentication required

### 1.2 User Login
POST /auth/login
Request: email, password
Response: JWT token, user_id, expires_in

### 1.3 Get User Profile  
GET /users/{user_id}
Authentication: Required
Response: User details

### 1.4 Update User Profile
PUT /users/{user_id}
Authentication: Required

### 1.5 Logout
POST /auth/logout
Authentication: Required

## 2. Provider Management

### 2.1 Register as Provider
POST /providers/register
Authentication: Required (user)

### 2.2 Get Provider Profile
GET /providers/{provider_id}
Authentication: Optional

### 2.3 Update Provider Profile
PUT /providers/{provider_id}
Authentication: Required

### 2.4 List All Providers
GET /providers?page=1&limit=20
Authentication: Optional
Filters: service_type, certification_level, rating

### 2.5 Get Provider Services
GET /providers/{provider_id}/services
Authentication: Optional

## 3. Service Management

### 3.1 Create Service
POST /services
Authentication: Required (provider)
Request: name, description, category, duration, price

### 3.2 Get Service
GET /services/{service_id}
Authentication: Optional

### 3.3 Update Service
PUT /services/{service_id}
Authentication: Required (provider owner)

### 3.4 Delete Service
DELETE /services/{service_id}
Authentication: Required (provider owner)

## 4. Booking Management

### 4.1 Create Booking
POST /bookings
Authentication: Required (user)
Request: provider_id, service_id, date, time, form_data
Response: 201 Created with booking_id

### 4.2 Get Booking
GET /bookings/{booking_id}
Authentication: Required (user/provider)

### 4.3 List User Bookings
GET /bookings/user/{user_id}
Authentication: Required
Filters: status, date_range

### 4.4 List Provider Bookings
GET /bookings/provider/{provider_id}
Authentication: Required (provider)
Filters: status, date_range

### 4.5 Update Booking Status
PATCH /bookings/{booking_id}/status
Authentication: Required
Request: status (pending, confirmed, completed, cancelled)

### 4.6 Cancel Booking
DELETE /bookings/{booking_id}
Authentication: Required
Allowed: 24 hours before appointment

## 5. Review & Rating

### 5.1 Submit Review
POST /reviews
Authentication: Required (user)
Request: booking_id, rating (1-5), comment
Response: 201 Created

### 5.2 Get Booking Reviews
GET /bookings/{booking_id}/reviews
Authentication: Optional

### 5.3 Get Provider Reviews
GET /providers/{provider_id}/reviews
Authentication: Optional

## 6. Payment

### 6.1 Create Payment Intent
POST /payments/intent
Authentication: Required (user)
Request: booking_id, amount, payment_method

### 6.2 Confirm Payment
POST /payments/confirm
Authentication: Required (user)
Request: payment_intent_id, token

### 6.3 Get Payment Status
GET /payments/{payment_id}
Authentication: Required

## 7. Certification & Credentials

### 7.1 Upload Certification
POST /certifications
Authentication: Required (provider)
Request: file, certification_type, expiry_date

### 7.2 Verify Certification
GET /certifications/{certification_id}/verify
Authentication: Optional

## 8. Form & Custom Fields

### 8.1 Create Booking Form
POST /forms
Authentication: Required (provider)
Request: form_fields (array of field configs)

### 8.2 Get Form
GET /forms/{form_id}
Authentication: Optional

## 9. Search & Discovery

### 9.1 Search Services
GET /services/search?q=query
Authentication: Optional
Filters: category, provider_id, rating, price_range

### 9.2 Get Service Categories
GET /categories
Authentication: Optional

## 10. Notifications

### 10.1 Get User Notifications
GET /notifications
Authentication: Required

### 10.2 Mark Notification as Read
PATCH /notifications/{notification_id}/read
Authentication: Required

## Summary
- Total Endpoints: 21
- Authentication: JWT-based
- Response Format: JSON
- Error Codes: Standard HTTP status codes
- Base URL: yourdomain.com/api/v1
