<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="training-center-container">
        <h1 class="about-hero-title">About Vina E&T Training Center</h1>
        <p class="about-hero-subtitle">
          Empowering minds through exceptional education and innovative learning experiences
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="about-content">
      <div class="training-center-container">
        <div class="about-layout">
          <!-- Left Sidebar Navigation -->
          <nav class="about-sidebar">
            <ul class="about-nav-list">
              <li 
                v-for="section in sections" 
                :key="section.id"
                class="about-nav-item"
                :class="{ active: activeSection === section.id }"
                @click="setActiveSection(section.id)"
              >
                <span class="nav-icon">{{ section.icon }}</span>
                <span class="nav-text">{{ section.title }}</span>
              </li>
            </ul>
          </nav>

          <!-- Right Content Area -->
          <main class="about-main">
            <!-- School Information Section -->
            <div v-if="activeSection === 'school-info'" class="about-section">
              <h2 class="section-title">Our School</h2>
              <div class="section-content">
                <!-- School Info Navigation -->
                <div class="school-info-nav">
                  <ul class="school-nav-list">
                    <li 
                      v-for="item in schoolInfoItems" 
                      :key="item.id"
                      class="school-nav-item"
                      :class="{ active: activeSchoolSection === item.id }"
                      @click="setActiveSchoolSection(item.id)"
                    >
                      <span class="school-nav-icon">{{ item.icon }}</span>
                      <span class="school-nav-text">{{ item.title }}</span>
                    </li>
                  </ul>
                </div>

                <!-- School Info Content -->
                <div class="school-info-content">
                  <!-- Our History -->
                  <div v-if="activeSchoolSection === 'history'" class="school-info-section">
                    <h3 class="school-section-title">🏫 Our History</h3>
                    <div class="school-section-content">
                      <p>
                        Founded in 2010, Vina E&T Training Center has been at the forefront of educational excellence 
                        in Vietnam. We started as a small institution with a big dream: to provide world-class 
                        education that bridges the gap between traditional learning and modern industry demands.
                      </p>
                      <p>
                        Over the years, we have grown from a modest training facility to a comprehensive educational 
                        institution, serving thousands of students and professionals across various industries.
                      </p>
                      <div class="timeline">
                        <div class="timeline-item">
                          <div class="timeline-year">2010</div>
                          <div class="timeline-content">
                            <h4>Foundation</h4>
                            <p>Vina E&T Training Center was established with a vision to provide quality education.</p>
                          </div>
                        </div>
                        <div class="timeline-item">
                          <div class="timeline-year">2015</div>
                          <div class="timeline-content">
                            <h4>Expansion</h4>
                            <p>Expanded our course offerings and partnered with leading technology companies.</p>
                          </div>
                        </div>
                        <div class="timeline-item">
                          <div class="timeline-year">2020</div>
                          <div class="timeline-content">
                            <h4>Digital Transformation</h4>
                            <p>Launched online learning platforms and virtual training programs.</p>
                          </div>
                        </div>
                        <div class="timeline-item">
                          <div class="timeline-year">2024</div>
                          <div class="timeline-content">
                            <h4>Recognition</h4>
                            <p>Awarded "Best Training Center" by Vietnam Education Association.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Our Mission -->
                  <div v-if="activeSchoolSection === 'mission'" class="school-info-section">
                    <h3 class="school-section-title">🎯 Our Mission</h3>
                    <div class="school-section-content">
                      <p>
                        To provide high-quality, practical education that prepares students for real-world challenges 
                        and career success. We believe in fostering critical thinking, creativity, and professional 
                        excellence in every student who walks through our doors.
                      </p>
                      <div class="mission-points">
                        <div class="mission-point">
                          <div class="mission-icon">🎓</div>
                          <div class="mission-text">
                            <h4>Quality Education</h4>
                            <p>Deliver world-class education that meets international standards and industry requirements.</p>
                          </div>
                        </div>
                        <div class="mission-point">
                          <div class="mission-icon">🚀</div>
                          <div class="mission-text">
                            <h4>Innovation</h4>
                            <p>Integrate cutting-edge technology and innovative teaching methods to enhance learning experiences.</p>
                          </div>
                        </div>
                        <div class="mission-point">
                          <div class="mission-icon">🤝</div>
                          <div class="mission-text">
                            <h4>Partnership</h4>
                            <p>Build strong partnerships with leading companies to provide real-world training opportunities.</p>
                          </div>
                        </div>
                        <div class="mission-point">
                          <div class="mission-icon">❤️</div>
                          <div class="mission-text">
                            <h4>Student Success</h4>
                            <p>Ensure every student achieves their personal and professional goals through our programs.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- By the Numbers -->
                  <div v-if="activeSchoolSection === 'numbers'" class="school-info-section">
                    <h3 class="school-section-title">📊 By the Numbers</h3>
                    <div class="school-section-content">
                      <div class="stats-vertical">
                        <div class="stat-item-vertical">
                          <div class="stat-icon">👥</div>
                          <div class="stat-content">
                            <span class="stat-number">5000+</span>
                            <span class="stat-label">Students Trained</span>
                            <p class="stat-description">Graduates who have successfully completed our programs</p>
                          </div>
                        </div>
                        <div class="stat-item-vertical">
                          <div class="stat-icon">📅</div>
                          <div class="stat-content">
                            <span class="stat-number">15+</span>
                            <span class="stat-label">Years Experience</span>
                            <p class="stat-description">Years of excellence in education and training</p>
                          </div>
                        </div>
                        <div class="stat-item-vertical">
                          <div class="stat-icon">👨‍🏫</div>
                          <div class="stat-content">
                            <span class="stat-number">50+</span>
                            <span class="stat-label">Expert Instructors</span>
                            <p class="stat-description">Qualified professionals with industry experience</p>
                          </div>
                        </div>
                        <div class="stat-item-vertical">
                          <div class="stat-icon">📈</div>
                          <div class="stat-content">
                            <span class="stat-number">95%</span>
                            <span class="stat-label">Success Rate</span>
                            <p class="stat-description">Job placement rate for our graduates</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Our Achievements -->
                  <div v-if="activeSchoolSection === 'achievements'" class="school-info-section">
                    <h3 class="school-section-title">🏆 Our Achievements</h3>
                    <div class="school-section-content">
                      <div class="achievements-vertical">
                        <div class="achievement-item">
                          <div class="achievement-icon">🏅</div>
                          <div class="achievement-content">
                            <h4>Best Training Center Award</h4>
                            <p>Recognized as "Best Training Center" by Vietnam Education Association (2022)</p>
                            <span class="achievement-year">2022</span>
                          </div>
                        </div>
                        <div class="achievement-item">
                          <div class="achievement-icon">🥇</div>
                          <div class="achievement-content">
                            <h4>ISO Certification</h4>
                            <p>ISO 9001:2015 Quality Management System Certification</p>
                            <span class="achievement-year">2021</span>
                          </div>
                        </div>
                        <div class="achievement-item">
                          <div class="achievement-icon">🌟</div>
                          <div class="achievement-content">
                            <h4>Industry Partnerships</h4>
                            <p>Partner with leading technology companies for industry training</p>
                            <span class="achievement-year">Ongoing</span>
                          </div>
                        </div>
                        <div class="achievement-item">
                          <div class="achievement-icon">📈</div>
                          <div class="achievement-content">
                            <h4>Job Placement Excellence</h4>
                            <p>95% job placement rate for our graduates</p>
                            <span class="achievement-year">2024</span>
                          </div>
                        </div>
                        <div class="achievement-item">
                          <div class="achievement-icon">🎓</div>
                          <div class="achievement-content">
                            <h4>Ministry Accreditation</h4>
                            <p>Accredited by Ministry of Education and Training</p>
                            <span class="achievement-year">2015</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- School Goals Section -->
            <div v-if="activeSection === 'goals'" class="about-section">
              <h2 class="section-title">Our Goals & Vision</h2>
              <div class="section-content">
                <div class="goals-container">
                  <div class="vision-card">
                    <h3>🔮 Our Vision</h3>
                    <p>
                      To become Vietnam's leading training center, recognized internationally for excellence 
                      in education, innovation, and student success. We envision a future where every graduate 
                      is equipped with the skills, knowledge, and confidence to excel in their chosen field.
                    </p>
                  </div>
                  
                  <div class="goals-grid">
                    <div class="goal-card">
                      <div class="goal-icon">🎓</div>
                      <h4>Educational Excellence</h4>
                      <p>Deliver world-class education that meets international standards and industry requirements.</p>
                    </div>
                    
                    <div class="goal-card">
                      <div class="goal-icon">🚀</div>
                      <h4>Innovation & Technology</h4>
                      <p>Integrate cutting-edge technology and innovative teaching methods to enhance learning experiences.</p>
                    </div>
                    
                    <div class="goal-card">
                      <div class="goal-icon">🤝</div>
                      <h4>Industry Partnership</h4>
                      <p>Build strong partnerships with leading companies to provide real-world training opportunities.</p>
                    </div>
                    
                    <div class="goal-card">
                      <div class="goal-icon">🌍</div>
                      <h4>Global Perspective</h4>
                      <p>Prepare students for global opportunities with international curriculum and cultural awareness.</p>
                    </div>
                    
                    <div class="goal-card">
                      <div class="goal-icon">💡</div>
                      <h4>Continuous Improvement</h4>
                      <p>Continuously evolve our programs based on industry trends and student feedback.</p>
                    </div>
                    
                    <div class="goal-card">
                      <div class="goal-icon">❤️</div>
                      <h4>Student Success</h4>
                      <p>Ensure every student achieves their personal and professional goals through our programs.</p>
                    </div>
                  </div>
                  
                  <div class="values-section">
                    <h3>💎 Our Core Values</h3>
                    <div class="values-list">
                      <div class="value-item">
                        <strong>Excellence:</strong> We strive for the highest standards in everything we do.
                      </div>
                      <div class="value-item">
                        <strong>Integrity:</strong> We maintain honesty, transparency, and ethical practices.
                      </div>
                      <div class="value-item">
                        <strong>Innovation:</strong> We embrace new ideas and technologies to improve education.
                      </div>
                      <div class="value-item">
                        <strong>Collaboration:</strong> We work together with students, staff, and industry partners.
                      </div>
                      <div class="value-item">
                        <strong>Respect:</strong> We value diversity and treat everyone with dignity and respect.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Staff Team Section -->
            <div v-if="activeSection === 'staff'" class="about-section">
              <h2 class="section-title">Our Team</h2>
              <div class="section-content">
                <div class="team-intro">
                  <p>
                    Our team consists of experienced professionals, industry experts, and passionate educators 
                    who are dedicated to providing the best learning experience for our students.
                  </p>
                </div>
                
                <div class="team-grid">
                  <div class="team-member">
                    <div class="member-avatar">
                      <span class="avatar-text">TN</span>
                    </div>
                    <div class="member-info">
                      <h4>Dr. Tran Nguyen</h4>
                      <p class="member-role">Director & Founder</p>
                      <p class="member-bio">
                        With over 20 years of experience in education and technology, Dr. Tran leads our 
                        institution with vision and dedication. He holds a Ph.D. in Computer Science and 
                        has published numerous research papers in international journals.
                      </p>
                      <div class="member-expertise">
                        <span class="expertise-tag">Education Leadership</span>
                        <span class="expertise-tag">Technology Innovation</span>
                        <span class="expertise-tag">Strategic Planning</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="team-member">
                    <div class="member-avatar">
                      <span class="avatar-text">LM</span>
                    </div>
                    <div class="member-info">
                      <h4>Ms. Le Minh</h4>
                      <p class="member-role">Academic Director</p>
                      <p class="member-bio">
                        Ms. Le brings 15 years of academic excellence to our team. She specializes in 
                        curriculum development and has designed several award-winning training programs 
                        that have been adopted by other institutions.
                      </p>
                      <div class="member-expertise">
                        <span class="expertise-tag">Curriculum Design</span>
                        <span class="expertise-tag">Academic Excellence</span>
                        <span class="expertise-tag">Quality Assurance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="team-member">
                    <div class="member-avatar">
                      <span class="avatar-text">PV</span>
                    </div>
                    <div class="member-info">
                      <h4>Mr. Pham Van</h4>
                      <p class="member-role">Technology Lead</p>
                      <p class="member-bio">
                        A former software engineer at leading tech companies, Mr. Pham now leads our 
                        technology initiatives. He ensures our students learn with the latest tools 
                        and technologies used in the industry.
                      </p>
                      <div class="member-expertise">
                        <span class="expertise-tag">Software Development</span>
                        <span class="expertise-tag">System Architecture</span>
                        <span class="expertise-tag">Cloud Computing</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="team-member">
                    <div class="member-avatar">
                      <span class="avatar-text">NH</span>
                    </div>
                    <div class="member-info">
                      <h4>Ms. Nguyen Hoang</h4>
                      <p class="member-role">Student Success Coordinator</p>
                      <p class="member-bio">
                        Ms. Nguyen is passionate about student success and career development. She works 
                        closely with students to ensure they achieve their goals and provides guidance 
                        for career planning and job placement.
                      </p>
                      <div class="member-expertise">
                        <span class="expertise-tag">Career Counseling</span>
                        <span class="expertise-tag">Student Support</span>
                        <span class="expertise-tag">Industry Relations</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="team-member">
                    <div class="member-avatar">
                      <span class="avatar-text">DT</span>
                    </div>
                    <div class="member-info">
                      <h4>Dr. Do Thanh</h4>
                      <p class="member-role">Senior Instructor</p>
                      <p class="member-bio">
                        Dr. Do is a seasoned instructor with expertise in data science and artificial 
                        intelligence. He has trained hundreds of professionals and is known for his 
                        practical, hands-on teaching approach.
                      </p>
                      <div class="member-expertise">
                        <span class="expertise-tag">Data Science</span>
                        <span class="expertise-tag">Machine Learning</span>
                        <span class="expertise-tag">Research</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="team-member">
                    <div class="member-avatar">
                      <span class="avatar-text">VH</span>
                    </div>
                    <div class="member-info">
                      <h4>Ms. Vo Hoa</h4>
                      <p class="member-role">Administrative Manager</p>
                      <p class="member-bio">
                        Ms. Vo ensures the smooth operation of our administrative functions. With her 
                        attention to detail and organizational skills, she keeps our institution running 
                        efficiently and supports both staff and students.
                      </p>
                      <div class="member-expertise">
                        <span class="expertise-tag">Administration</span>
                        <span class="expertise-tag">Operations</span>
                        <span class="expertise-tag">Customer Service</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="team-stats">
                  <h3>Our Team at a Glance</h3>
                  <div class="stats-row">
                    <div class="stat-box">
                      <span class="stat-number">50+</span>
                      <span class="stat-label">Expert Instructors</span>
                    </div>
                    <div class="stat-box">
                      <span class="stat-number">15+</span>
                      <span class="stat-label">Years Average Experience</span>
                    </div>
                    <div class="stat-box">
                      <span class="stat-number">95%</span>
                      <span class="stat-label">Student Satisfaction</span>
                    </div>
                    <div class="stat-box">
                      <span class="stat-number">24/7</span>
                      <span class="stat-label">Student Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { publicApi } from '../helpers/adminApi'

export default {
  name: 'About',
  setup() {
    const activeSection = ref('school-info')
    const activeSchoolSection = ref('history')
    const aboutContent = ref({})
    const loading = ref(true)
    
    const sections = [
      {
        id: 'school-info',
        title: 'School Information',
        icon: '🏫'
      },
      {
        id: 'goals',
        title: 'Our Goals',
        icon: '🎯'
      },
      {
        id: 'staff',
        title: 'Our Team',
        icon: '👥'
      }
    ]
    
    const schoolInfoItems = [
      {
        id: 'history',
        title: 'Our History',
        icon: '🏫'
      },
      {
        id: 'mission',
        title: 'Our Mission',
        icon: '🎯'
      },
      {
        id: 'numbers',
        title: 'By the Numbers',
        icon: '📊'
      },
      {
        id: 'achievements',
        title: 'Our Achievements',
        icon: '🏆'
      }
    ]

    // Computed properties for dynamic content
    const heroContent = computed(() => aboutContent.value.hero || {
      title: 'About Vina E&T Training Center',
      content: 'Empowering minds through exceptional education and innovative learning experiences'
    })

    const historyContent = computed(() => aboutContent.value.history || {
      title: 'Our History',
      content: 'Founded in 2010, Vina E&T Training Center has been at the forefront of educational excellence in Vietnam...'
    })

    const missionContent = computed(() => aboutContent.value.mission || {
      title: 'Our Mission',
      content: 'To provide high-quality, practical education that prepares students for real-world challenges...'
    })

    const numbersContent = computed(() => aboutContent.value.numbers || {
      title: 'By the Numbers',
      content: 'Our achievements speak for themselves...'
    })

    const achievementsContent = computed(() => aboutContent.value.achievements || {
      title: 'Our Achievements',
      content: 'We are proud of our accomplishments...'
    })

    const visionContent = computed(() => aboutContent.value.vision || {
      title: 'Our Vision',
      content: 'To become Vietnam\'s leading training center...'
    })

    const goalsContent = computed(() => aboutContent.value.goals || {
      title: 'Our Goals',
      content: 'Our goals and objectives...'
    })

    const valuesContent = computed(() => aboutContent.value.values || {
      title: 'Our Values',
      content: 'Our core values...'
    })

    const teamContent = computed(() => aboutContent.value.team || {
      title: 'Our Team',
      content: 'Meet our amazing team...'
    })
    
    const setActiveSection = (sectionId) => {
      activeSection.value = sectionId
    }
    
    const setActiveSchoolSection = (sectionId) => {
      activeSchoolSection.value = sectionId
    }

    const loadAboutContent = async () => {
      try {
        loading.value = true
        const content = await publicApi.about.getAll()
        aboutContent.value = content
      } catch (error) {
        console.error('Error loading about content:', error)
        // Fallback to static content if API fails
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      loadAboutContent()
    })
    
    return {
      activeSection,
      activeSchoolSection,
      aboutContent,
      loading,
      sections,
      schoolInfoItems,
      heroContent,
      historyContent,
      missionContent,
      numbersContent,
      achievementsContent,
      visionContent,
      goalsContent,
      valuesContent,
      teamContent,
      setActiveSection,
      setActiveSchoolSection
    }
  }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: var(--training-center-white);
}

/* Hero Section */
.about-hero {
  background: linear-gradient(135deg, var(--training-center-primary) 0%, var(--training-center-primary-dark) 100%);
  color: var(--training-center-white);
  padding: var(--spacing-xxxl) 0;
  text-align: center;
}

.about-hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--training-center-white);
}

.about-hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* Main Content Layout */
.about-content {
  padding: var(--spacing-xxxl) 0;
}

.about-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-xxxl);
  max-width: 1200px;
  margin: 0 auto;
}

/* Sidebar Navigation */
.about-sidebar {
  background: var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  height: fit-content;
  position: sticky;
  top: var(--spacing-xl);
}

.about-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.about-nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--training-center-gray-dark);
  font-weight: 500;
}

.about-nav-item:hover {
  background: var(--training-center-white);
  color: var(--training-center-primary);
  transform: translateX(5px);
}

.about-nav-item.active {
  background: var(--training-center-primary);
  color: var(--training-center-white);
  box-shadow: var(--shadow-medium);
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 0.95rem;
}

/* Main Content Area */
.about-main {
  background: var(--training-center-white);
  border-radius: var(--border-radius);
  padding: var(--spacing-xxxl);
  box-shadow: var(--shadow-subtle);
}

.section-title {
  font-size: 2.5rem;
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xl);
  border-bottom: 3px solid var(--training-center-primary);
  padding-bottom: var(--spacing-md);
}

.section-content {
  line-height: 1.7;
}

/* School Information Styles */
.school-info-nav {
  background: var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.school-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
}

.school-nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--training-center-gray-dark);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.school-nav-item:hover {
  background: var(--training-center-white);
  color: var(--training-center-primary);
  transform: translateY(-2px);
}

.school-nav-item.active {
  background: var(--training-center-primary);
  color: var(--training-center-white);
  box-shadow: var(--shadow-medium);
}

.school-nav-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.school-nav-text {
  font-size: 0.9rem;
}

.school-info-content {
  background: var(--training-center-white);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-subtle);
}

.school-section-title {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-lg);
  font-size: 1.75rem;
  border-bottom: 2px solid var(--training-center-primary);
  padding-bottom: var(--spacing-sm);
}

.school-section-content {
  line-height: 1.7;
}

.school-section-content p {
  margin-bottom: var(--spacing-lg);
  color: var(--training-center-gray-dark);
}

/* Timeline Styles */
.timeline {
  margin-top: var(--spacing-xl);
  position: relative;
  padding-left: var(--spacing-lg);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--training-center-primary);
}

.timeline-item {
  position: relative;
  margin-bottom: var(--spacing-xl);
  padding-left: var(--spacing-xl);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 5px;
  width: 16px;
  height: 16px;
  background: var(--training-center-primary);
  border-radius: 50%;
  border: 3px solid var(--training-center-white);
  box-shadow: 0 0 0 3px var(--training-center-primary);
}

.timeline-year {
  background: var(--training-center-primary);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: var(--spacing-sm);
}

.timeline-content h4 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xs);
  font-size: 1.1rem;
}

.timeline-content p {
  color: var(--training-center-gray-dark);
  margin-bottom: 0;
  font-size: 0.95rem;
}

/* Mission Points */
.mission-points {
  margin-top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.mission-point {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--training-center-primary);
}

.mission-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.mission-text h4 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xs);
  font-size: 1.1rem;
}

.mission-text p {
  color: var(--training-center-gray-dark);
  margin-bottom: 0;
  font-size: 0.95rem;
}

/* Vertical Stats */
.stats-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.stat-item-vertical {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--training-center-primary);
}

.stat-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--training-center-gray-dark);
  margin-bottom: var(--spacing-xs);
}

.stat-description {
  color: var(--training-center-gray-medium);
  margin-bottom: 0;
  font-size: 0.9rem;
}

/* Vertical Achievements */
.achievements-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--training-center-primary);
  transition: all 0.3s ease;
}

.achievement-item:hover {
  transform: translateX(5px);
  box-shadow: var(--shadow-medium);
}

.achievement-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
}

.achievement-content h4 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xs);
  font-size: 1.1rem;
}

.achievement-content p {
  color: var(--training-center-gray-dark);
  margin-bottom: var(--spacing-sm);
  font-size: 0.95rem;
}

.achievement-year {
  background: var(--training-center-primary);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Goals Section Styles */
.goals-container {
  max-width: 100%;
}

.vision-card {
  background: linear-gradient(135deg, var(--training-center-primary) 0%, var(--training-center-primary-dark) 100%);
  color: var(--training-center-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.vision-card h3 {
  color: var(--training-center-white);
  margin-bottom: var(--spacing-md);
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.goal-card {
  background: var(--training-center-white);
  border: 2px solid var(--training-center-gray-lighter);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  text-align: center;
  transition: all 0.3s ease;
}

.goal-card:hover {
  border-color: var(--training-center-primary);
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.goal-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.goal-card h4 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-md);
}

.values-section {
  background: var(--training-center-gray-lighter);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
}

.values-section h3 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.values-list {
  display: grid;
  gap: var(--spacing-md);
}

.value-item {
  padding: var(--spacing-md);
  background: var(--training-center-white);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--training-center-primary);
}

/* Team Section Styles */
.team-intro {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-size: 1.1rem;
  color: var(--training-center-gray-medium);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.team-member {
  background: var(--training-center-white);
  border: 1px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-lg);
  transition: all 0.3s ease;
}

.team-member:hover {
  box-shadow: var(--shadow-medium);
  transform: translateY(-3px);
}

.member-avatar {
  width: 80px;
  height: 80px;
  background: var(--training-center-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: var(--training-center-white);
  font-size: 1.5rem;
  font-weight: 700;
}

.member-info {
  flex: 1;
}

.member-info h4 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xs);
  font-size: 1.25rem;
}

.member-role {
  color: var(--training-center-gray-medium);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  font-size: 0.95rem;
}

.member-bio {
  color: var(--training-center-gray-dark);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.member-expertise {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.expertise-tag {
  background: var(--training-center-gray-lighter);
  color: var(--training-center-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.team-stats {
  background: var(--training-center-gray-lighter);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  text-align: center;
}

.team-stats h3 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-lg);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
}

.stat-box {
  background: var(--training-center-white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  border: 2px solid var(--training-center-primary);
}

.stat-box .stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-box .stat-label {
  font-size: 0.9rem;
  color: var(--training-center-gray-medium);
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .about-layout {
    grid-template-columns: 250px 1fr;
    gap: var(--spacing-xl);
  }
  
  .about-main {
    padding: var(--spacing-xl);
  }
}

@media (max-width: 768px) {
  .about-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .about-sidebar {
    position: static;
    order: 2;
  }
  
  .about-nav-list {
    display: flex;
    overflow-x: auto;
    gap: var(--spacing-sm);
    padding-bottom: var(--spacing-sm);
  }
  
  .about-nav-item {
    white-space: nowrap;
    margin-bottom: 0;
    min-width: 150px;
  }
  
  .about-main {
    order: 1;
    padding: var(--spacing-lg);
  }
  
  .about-hero-title {
    font-size: 2.25rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .goals-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .school-nav-list {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .school-nav-item {
    justify-content: flex-start;
  }
  
  .mission-point,
  .stat-item-vertical,
  .achievement-item {
    flex-direction: column;
    text-align: center;
  }
  
  .mission-icon,
  .stat-icon,
  .achievement-icon {
    align-self: center;
  }
  
  .team-member {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .about-hero {
    padding: var(--spacing-xl) 0;
  }
  
  .about-hero-title {
    font-size: 1.875rem;
  }
  
  .about-hero-subtitle {
    font-size: 1rem;
  }
  
  .about-content {
    padding: var(--spacing-xl) 0;
  }
  
  .about-main {
    padding: var(--spacing-md);
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
