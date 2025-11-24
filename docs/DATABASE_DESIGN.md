# Database Design Specification

**Project**: TTS Booking System  
**Version**: 1.0  
**Last Updated**: 2025-11-24

---

## Overview

This document defines the database schema for the TTS Booking System. The system requires 12 core tables to support booking management, provider services, payment tracking, and user reviews.

## Database Selection

**Chosen**: PostgreSQL  
**Reasons**:
- Better JSON support for custom form structures
- Advanced indexing capabilities
- Strong ACID compliance
- Good Azure integration

---

## Core Tables

### 1. users
Stores all system users (both clients and providers)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for social login
  display_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  user_type ENUM('client', 'provider', 'admin') DEFAULT 'client',
  social_provider VARCHAR(50), -- 'line', 'facebook', 'email'
  social_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_social ON users(social_provider, social_id);
```

### 2. providers
Extended information for service providers

```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(200),
  bio TEXT,
  specialties TEXT[], -- Array of specialty tags
  certifications JSONB, -- Store certification details
  subscription_plan VARCHAR(50) DEFAULT 'basic',
  subscription_status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  subscription_expires_at TIMESTAMP,
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approval_notes TEXT,
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id)
);

CREATE INDEX idx_providers_user ON providers(user_id);
CREATE INDEX idx_providers_status ON providers(approval_status);
```

### 3. services
Services offered by providers

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TWD',
  service_type VARCHAR(100), -- Category/type
  is_online BOOLEAN DEFAULT FALSE,
  location TEXT,
  max_capacity INTEGER DEFAULT 1,
  image_url TEXT,
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_active ON services(is_active, approval_status);
```

### 4. availability
Provider availability time slots

```sql
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  specific_date DATE, -- NULL for recurring, set for one-time
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_availability_provider ON availability(provider_id);
CREATE INDEX idx_availability_date ON availability(specific_date);
```

### 5. bookings
Client booking records

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  service_id UUID NOT NULL REFERENCES services(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
  cancellation_reason TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TWD',
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### 6. payments
Payment transaction records (from ECPay webhook)

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  client_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TWD',
  payment_method VARCHAR(50), -- 'credit_card', 'atm', 'cvs'
  ecpay_merchant_id VARCHAR(100), -- Provider's ECPay ID
  ecpay_transaction_id VARCHAR(200),
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  paid_at TIMESTAMP,
  webhook_data JSONB, -- Store full webhook response
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_ecpay ON payments(ecpay_transaction_id);
```

### 7. provider_payment_info
Provider's ECPay integration settings

```sql
CREATE TABLE provider_payment_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  merchant_id VARCHAR(100) NOT NULL,
  hash_key VARCHAR(255) NOT NULL, -- Encrypted
  hash_iv VARCHAR(255) NOT NULL, -- Encrypted
  is_active BOOLEAN DEFAULT TRUE,
  test_mode BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(provider_id)
);

CREATE INDEX idx_provider_payment ON provider_payment_info(provider_id);
```

### 8. custom_forms
Custom intake forms created by providers

```sql
CREATE TABLE custom_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  form_schema JSONB NOT NULL, -- JSON structure of form fields
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_custom_forms_provider ON custom_forms(provider_id);
CREATE INDEX idx_custom_forms_service ON custom_forms(service_id);
```

### 9. form_responses
Client responses to custom forms

```sql
CREATE TABLE form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  form_id UUID NOT NULL REFERENCES custom_forms(id),
  client_id UUID NOT NULL REFERENCES users(id),
  response_data JSONB NOT NULL, -- JSON of answers
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_form_responses_booking ON form_responses(booking_id);
CREATE INDEX idx_form_responses_client ON form_responses(client_id);
```

### 10. reviews
Client reviews for services/providers

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  client_id UUID NOT NULL REFERENCES users(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  service_id UUID NOT NULL REFERENCES services(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  provider_reply TEXT,
  provider_replied_at TIMESTAMP,
  is_visible BOOLEAN DEFAULT TRUE,
  moderation_status ENUM('approved', 'pending', 'rejected') DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(booking_id)
);

CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_service ON reviews(service_id);
CREATE INDEX idx_reviews_visible ON reviews(is_visible, moderation_status);
```

### 11. badges
Provider certification badges

```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  badge_type VARCHAR(50), -- 'platform', 'certification', 'achievement'
  criteria JSONB, -- Requirements to earn
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE provider_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id),
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  verification_doc_url TEXT,
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  
  UNIQUE(provider_id, badge_id)
);

CREATE INDEX idx_provider_badges_provider ON provider_badges(provider_id);
```

### 12. notifications
System notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'booking', 'payment', 'review', 'system'
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  sent_via VARCHAR(50), -- 'email', 'line', 'in_app'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

---

## Entity Relationships

```
users (1) ----< (M) bookings
users (1) ----< (1) providers
providers (1) ----< (M) services
providers (1) ----< (M) availability
providers (1) ----< (M) bookings
providers (1) ----< (1) provider_payment_info
providers (1) ----< (M) custom_forms
providers (1) ----< (M) reviews
providers (1) ----< (M) provider_badges
services (1) ----< (M) bookings
bookings (1) ----< (1) payments
bookings (1) ----< (1) reviews
bookings (1) ----< (M) form_responses
custom_forms (1) ----< (M) form_responses
badges (1) ----< (M) provider_badges
```

---

## Indexes Strategy

Key indexes have been added for:
- Foreign key relationships
- Frequently queried fields (email, status, dates)
- Composite indexes for common query patterns

---

## Security Considerations

1. **Password Storage**: Using bcrypt for password hashing
2. **ECPay Credentials**: Encrypt `hash_key` and `hash_iv` at application level
3. **UUIDs**: Using UUID v4 for all primary keys to prevent enumeration
4. **Soft Deletes**: Status fields instead of actual deletion where needed
5. **Audit Trail**: `created_at` and `updated_at` on all tables

---

## Next Steps

- [ ] Create migration scripts
- [ ] Set up database connection pooling
- [ ] Implement data access layer (repositories)
- [ ] Add database seeding for development
- [ ] Set up automated backups

---

*Database design completed: 2025-11-24*
