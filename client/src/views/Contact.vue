<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="training-center-container">
        <h1 class="contact-hero-title">Contact Us</h1>
        <p class="contact-hero-subtitle">
          Get in touch with us for any questions or inquiries
        </p>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="contact-content">
      <div class="training-center-container">
        <div class="contact-grid">
          <!-- Contact Information -->
          <div class="contact-info">
            <h2>Get in Touch</h2>
            <div class="contact-details">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div>
                  <h4>Address</h4>
                  <p>123 Education Street, Hanoi, Vietnam</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+84 965319566</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <p>contact@hhtnb-edu-vn.org</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🕒</span>
                <div>
                  <h4>Office Hours</h4>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM<br>
                  Saturday: 9:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-section">
            <h2>Send us a Message</h2>
            <form class="contact-form">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" required>
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <button type="submit" class="training-center-btn training-center-btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  setup() {
    return {
      // Add any reactive data or methods here
    }
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: var(--training-center-white);
}

.contact-hero {
  background: linear-gradient(135deg, var(--training-center-primary) 0%, var(--training-center-primary-dark) 100%);
  color: var(--training-center-white);
  padding: var(--spacing-xxxl) 0;
  text-align: center;
}

.contact-hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--training-center-white);
}

.contact-hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.contact-content {
  padding: var(--spacing-xxxl) 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xxxl);
  max-width: 1000px;
  margin: 0 auto;
}

.contact-info h2,
.contact-form-section h2 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xl);
  font-size: 2rem;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
}

.contact-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.contact-item h4 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xs);
  font-size: 1.1rem;
}

.contact-item p {
  color: var(--training-center-gray-dark);
  margin: 0;
  line-height: 1.6;
}

.contact-form {
  background: var(--training-center-gray-lighter);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  color: var(--training-center-gray-dark);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  font-family: var(--training-center-font-secondary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--training-center-primary);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  .contact-hero-title {
    font-size: 2.25rem;
  }
  
  .contact-info h2,
  .contact-form-section h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .contact-hero {
    padding: var(--spacing-xl) 0;
  }
  
  .contact-hero-title {
    font-size: 1.875rem;
  }
  
  .contact-hero-subtitle {
    font-size: 1rem;
  }
  
  .contact-content {
    padding: var(--spacing-xl) 0;
  }
  
  .contact-form {
    padding: var(--spacing-lg);
  }
}
</style>
