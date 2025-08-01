<template>
  <div class="home-page">
    <!-- Training Center Hero Section -->
    <section class="training-center-hero parallax-container">
      <div class="hero-background">
        <div class="hero-bg-image"></div>
        <div class="hero-overlay"></div>
      </div>
      <div class="parallax-bg" data-speed="0.3"></div>
      <div class="training-center-container">
        <div class="hero-content text-center">
          <h1 class="training-center-hero-title fade-in">
            Excellence in Education
          </h1>
          <p class="training-center-hero-subtitle slide-up">
            Discover transformative learning experiences that empower minds and shape futures through world-class instruction and innovative pedagogy.
          </p>
          <div class="hero-actions slide-up">
            <router-link to="/courses" class="training-center-btn training-center-btn-primary training-center-btn-large hover-lift">
              Explore Courses
              <i class="icon-arrow-right"></i>
            </router-link>
            <router-link to="/register" class="training-center-btn training-center-btn-outline training-center-btn-large hover-lift" v-if="!authStore.isAuthenticated">
              Join Our Community
            </router-link>
          </div>
          
          <!-- Statistics Section -->
          <div class="hero-stats slide-up">
            <div class="stat-item">
              <div class="stat-number animate-number">{{ stats.totalCourses }}</div>
              <div class="stat-label">Courses Available</div>
            </div>
            <div class="stat-item">
              <div class="stat-number animate-number">{{ stats.totalStudents }}</div>
              <div class="stat-label">Students Enrolled</div>
            </div>
            <div class="stat-item">
              <div class="stat-number animate-number">{{ stats.totalInstructors }}</div>
              <div class="stat-label">Expert Instructors</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Academic Excellence Section -->
    <section class="training-center-section academic-excellence">
      <div class="training-center-container">
        <div class="section-header text-center mb-xl">
          <h2 class="slide-up">Academic Excellence</h2>
          <p class="section-description slide-up">
            Our commitment to educational excellence drives everything we do, from curriculum design to student support.
          </p>
        </div>
        
        <div class="training-center-grid training-center-grid-3">
          <div class="training-center-feature slide-left" v-for="(feature, index) in academicFeatures" :key="index">
            <div class="training-center-feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3 class="training-center-feature-title">{{ feature.title }}</h3>
            <p class="training-center-feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses Section -->
    <section class="training-center-section featured-courses" v-if="featuredCourses.length > 0">
      <div class="training-center-container">
        <div class="section-header text-center mb-xl">
          <h2 class="slide-up">Featured Courses</h2>
          <p class="section-description slide-up">
            Explore our most popular and impactful courses, designed by industry experts and academic leaders.
          </p>
        </div>
        
        <div class="training-center-grid training-center-grid-3">
          <div class="course-card training-center-card hover-lift slide-up" 
               v-for="(course, index) in featuredCourses" 
               :key="course._id"
               :style="{ 
                 animationDelay: `${index * 200}ms`,
                 backgroundImage: `url(${course.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'})`
               }">
            <div class="course-header">
              <div class="course-category">{{ course.category }}</div>
              <div class="course-price">${{ course.price }}</div>
            </div>
            <h3 class="training-center-card-title">{{ course.title }}</h3>
            <div class="training-center-card-meta">
              <span class="instructor">by {{ course.instructor }}</span>
              <br>
              <span class="duration">{{ formatDuration(course.duration) }}</span>
            </div>
            <p class="training-center-card-content">
              {{ truncateDescription(course.description, 120) }}
            </p>
            <div class="course-meta">
              <div class="course-info">
                <span class="start-date">
                  <i class="icon-calendar"></i>
                  {{ formatDate(course.startDate) }}
                </span>
                <span class="max-students">
                  <i class="icon-users"></i>
                  {{ course.maxStudents }} seats
                </span>
              </div>
            </div>
            <div class="card-actions">
              <router-link :to="'/courses/show/' + course._id" class="training-center-btn training-center-btn-primary">
                View Details
              </router-link>
              <button class="training-center-btn training-center-btn-outline" @click="addToWishlist(course)">
                <i class="icon-heart"></i>
                Save
              </button>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-xl">
          <router-link to="/courses" class="training-center-btn training-center-btn-outline training-center-btn-large">
            View All Courses
            <i class="icon-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Learning Approach Section -->
    <section class="training-center-section learning-approach">
      <div class="training-center-container">
        <div class="training-center-grid training-center-grid-2">
          <div class="approach-content slide-left">
            <h2>Our Learning Approach</h2>
            <p class="mb-md">
              We believe in transformative education that goes beyond traditional boundaries. Our pedagogical approach combines rigorous academic standards with practical application.
            </p>
            <ul class="approach-list">
              <li class="approach-item" v-for="item in learningApproach" :key="item.title">
                <div class="approach-text">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="approach-visual slide-right">
                          <div class="visual-element">
                <!-- Professional classroom image -->
                <img src="https://extension.harvard.edu/wp-content/uploads/sites/8/2021/03/male-harvard-extension-student.jpg" class="learning-approach-image">
              </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Research & Innovation Section -->
    <section class="training-center-section research-innovation">
      <div class="training-center-container">
        <div class="section-header text-center mb-xl">
          <h2 class="slide-up">Research & Innovation</h2>
          <p class="section-description slide-up">
            At the forefront of educational research, we continuously evolve our methods to provide cutting-edge learning experiences.
          </p>
        </div>
        
        <div class="research-highlights">
          <div
            class="research-item slide-up"
            v-for="(item, index) in researchHighlights"
            :key="index"
            :class="{ 'reverse-row': item.title === 'AI-Enhanced Learning' }"
          >
            <div class="research-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <a href="#" class="research-link">Learn More</a>
            </div>
            <img :src="item.image" :alt="item.title + ' image'" class="research-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="training-center-section cta-section">
      <div class="training-center-container">
        <div class="cta-content text-center">
          <h2 class="slide-up">Ready to Begin Your Journey?</h2>
          <p class="cta-description slide-up">
            Join thousands of learners who have transformed their careers and expanded their knowledge through our comprehensive programs.
          </p>
          <div class="cta-actions slide-up">
            <router-link to="/register" class="training-center-btn training-center-btn-primary training-center-btn-large" v-if="!authStore.isAuthenticated">
              Get Started Today
            </router-link>
            <router-link to="/courses" class="training-center-btn training-center-btn-outline training-center-btn-large">
              Browse Courses
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="site-footer">
      <div class="training-center-container">
        <div class="footer-content training-center-grid training-center-grid-3">
          <div class="footer-section slide-up">
            <h4>Vina E&T Training Center</h4>
            <p>Empowering minds through exceptional education and innovative learning experiences.</p>
            <div class="social-links">
              <a href="#" class="social-link"><i class="icon-facebook"></i></a>
              <a href="#" class="social-link"><i class="icon-twitter"></i></a>
              <a href="#" class="social-link"><i class="icon-linkedin"></i></a>
            </div>
          </div>
          <div class="footer-section slide-up">
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><router-link to="/courses">All Courses</router-link></li>
              <li><router-link to="/register" v-if="!authStore.isAuthenticated">Join Now</router-link></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section slide-up">
            <h4>Contact Info</h4>
            <div class="contact-info">
              <p><i class="icon-location"></i> 123 Education Street, Hanoi</p>
              <p><i class="icon-phone"></i> +84 965319566</p>
              <p><i class="icon-email"></i> contact@hhtnb-edu-vn.org</p>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Training Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { getCourses } from '../helpers/api'
import { authStore } from '../store/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'Home',
  setup() {
    const toast = useToast()
    const featuredCourses = ref([])
    const stats = ref({
      totalCourses: 0,
      totalStudents: 2400,
      totalInstructors: 48
    })
    
    const academicFeatures = ref([
      {
        icon: 'icon-graduation-cap',
        title: 'Expert Faculty',
        description: 'Learn from distinguished professors and industry leaders with decades of experience in their respective fields.'
      },
      {
        icon: 'icon-lightbulb',
        title: 'Innovative Curriculum',
        description: 'Our cutting-edge curriculum is designed to meet current industry demands and future challenges.'
      },
      {
        icon: 'icon-globe',
        title: 'Global Perspective',
        description: 'Gain international insights and connect with learners from around the world in our diverse community.'
      }
    ])
    
    const learningApproach = ref([
      {
        icon: 'icon-book',
        title: 'Rigorous Academics',
        description: 'Comprehensive theoretical foundation combined with practical application.'
      },
      {
        icon: 'icon-users',
        title: 'Collaborative Learning',
        description: 'Engage with peers through group projects and interactive discussions.'
      },
      {
        icon: 'icon-chart',
        title: 'Data-Driven Insights',
        description: 'Track your progress with detailed analytics and personalized feedback.'
      },
      {
        icon: 'icon-certificate',
        title: 'Industry Recognition',
        description: 'Earn certificates that are recognized by leading employers worldwide.'
      }
    ])
    
    const researchHighlights = ref([
      {
        title: 'Pedagogical Research',
        description: 'Advancing the science of learning through innovative research initiatives. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur sed ipsum quis aliquam. Integer lobortis risus ac enim auctor rutrum. Nullam suscipit odio non felis sollicitudin dictum. Sed nec purus eu magna hendrerit tempor. Duis maximus turpis ut arcu sodales ultricies. Donec et justo auctor, commodo magna sit amet, tempor magna. Nam sit amet bibendum dolor, ut aliquet sem. Sed a mi orci. Aenean hendrerit fermentum quam et convallis. Aliquam lorem odio, consectetur et tristique vel, hendrerit sit amet elit. Phasellus interdum nisi et ex laoreet, vitae rhoncus mauris sodales. Donec sit amet convallis eros. Donec magna augue, ullamcorper nec metus a, mattis vulputate purus.',
        image: 'https://www.eng.mcmaster.ca//app/uploads/2025/02/Students-in-Eng-Phys-LAb-1-1600x790.jpg',
      },
      {
        title: 'AI-Enhanced Learning',
        description: 'Utilizing artificial intelligence to personalize and optimize learning experiences. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur sed ipsum quis aliquam. Integer lobortis risus ac enim auctor rutrum. Nullam suscipit odio non felis sollicitudin dictum. Sed nec purus eu magna hendrerit tempor. Duis maximus turpis ut arcu sodales ultricies. Donec et justo auctor, commodo magna sit amet, tempor magna. Nam sit amet bibendum dolor, ut aliquet sem. Sed a mi orci. Aenean hendrerit fermentum quam et convallis. Aliquam lorem odio, consectetur et tristique vel, hendrerit sit amet elit. Phasellus interdum nisi et ex laoreet, vitae rhoncus mauris sodales. Donec sit amet convallis eros. Donec magna augue, ullamcorper nec metus a, mattis vulputate purus.',
        image: 'https://cdn.standardmedia.co.ke/images/wysiwyg/images/Za4ythzrgGLcFtyrw9L0DmMYUJrPrWSRBKL5Cz6k.jpg'
      },
      {
        title: 'Learning Analytics',
        description: 'Leveraging data to understand and improve educational outcomes. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur sed ipsum quis aliquam. Integer lobortis risus ac enim auctor rutrum. Nullam suscipit odio non felis sollicitudin dictum. Sed nec purus eu magna hendrerit tempor. Duis maximus turpis ut arcu sodales ultricies. Donec et justo auctor, commodo magna sit amet, tempor magna. Nam sit amet bibendum dolor, ut aliquet sem. Sed a mi orci. Aenean hendrerit fermentum quam et convallis. Aliquam lorem odio, consectetur et tristique vel, hendrerit sit amet elit. Phasellus interdum nisi et ex laoreet, vitae rhoncus mauris sodales. Donec sit amet convallis eros. Donec magna augue, ullamcorper nec metus a, mattis vulputate purus.',
        image: 'https://w87ykxbardld-u6814.pressidiumcdn.com/wp-content/uploads/2024/07/learning-analytics-data-1200x800-1-1024x683.jpg'
      }
    ])
    
    const currentYear = computed(() => new Date().getFullYear())
    
    const fetchFeaturedCourses = async () => {
      try {
        const allCourses = await getCourses()
        featuredCourses.value = allCourses.slice(0, 3)
        // Update the total courses count with actual data
        stats.value.totalCourses = allCourses.length
      } catch (error) {
        console.error('Error fetching featured courses:', error)
        toast.error('Failed to load featured courses')
      }
    }
    
    const truncateDescription = (description, maxLength) => {
      if (description.length <= maxLength) return description
      return description.substring(0, maxLength) + '...'
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    const addToWishlist = (course) => {
      // Placeholder for wishlist functionality
      toast.success(`${course.title} added to wishlist`)
    }

    function formatDuration(duration) {
      if (!duration) return ''
      // Expecting format: '3 week', '1 year', etc.
      const match = duration.match(/(\d+)\s*(\w+)/)
      if (!match) return duration
      const num = parseInt(match[1])
      let unit = match[2].toLowerCase()
      // Normalize unit
      if (unit.endsWith('s')) unit = unit.slice(0, -1)
      let displayUnit = unit
      if (num > 1) {
        if (unit === 'day') displayUnit = 'days'
        else if (unit === 'week') displayUnit = 'weeks'
        else if (unit === 'month') displayUnit = 'months'
        else if (unit === 'year') displayUnit = 'years'
      } else {
        displayUnit = unit
      }
      return `${num} ${displayUnit}`
    }
    
    onMounted(async () => {
      await fetchFeaturedCourses()
      
      // Initialize animations after content loads
      setTimeout(() => {
              if (typeof TrainingCenterAnimations !== 'undefined') {
        const animations = new TrainingCenterAnimations()
          animations.animateNumbers()
        }
      }, 500)
    })

    return {
      authStore,
      featuredCourses,
      stats,
      academicFeatures,
      learningApproach,
      researchHighlights,
      currentYear,
      truncateDescription,
      formatDate,
      addToWishlist,
      formatDuration
    }
  }
}
</script>
<style scoped>
/* Hero Section Styles */
.training-center-hero {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://s3.amazonaws.com/thumbnails.thecrimson.com/photos/2023/07/03/173701_1364387.jpg.1500x1000_q95_crop-smart_upscale.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 2;
}

.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.training-center-container {
  position: relative;
  z-index: 4;
}

.hero-content {
  position: relative;
  z-index: 4;
  color: white;
}

.training-center-hero-title {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  white-space: nowrap; /* Prevent line breaks */
  word-spacing: normal; /* Ensure normal word spacing */
  letter-spacing: normal; /* Ensure normal letter spacing */
}

.training-center-hero-subtitle {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  margin: var(--spacing-xl) 0;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xxxl);
  margin-top: var(--spacing-xxxl);
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  display: block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: var(--spacing-xs);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Section Headers */
.section-header {
  max-width: 600px;
  margin: 0 auto;
}

.section-description {
  font-size: 1.1rem;
  color: var(--training-center-gray-medium);
  line-height: 1.7;
}

/* Academic Excellence */
.academic-excellence {
  background: var(--training-center-gray-lighter);
}

/* Course Cards */
.course-card {
  position: relative;
  background-size: cover;
  background-position: center;
  transition: all 0.3s ease;
}

.course-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  transition: background 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px) scale(1.02);
  background-size: 110% 110%;
}

.course-card:hover::before {
  background: rgba(255, 255, 255, 1);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  position: relative;
  z-index: 2;
}

.course-category {
  background: #0B5772; /* Match View Details button */
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}

.course-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--training-center-primary);
}

.training-center-card-title {
  margin-bottom: var(--spacing-sm);
  color: var(--training-center-gray-dark);
  font-size: 1.25rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.training-center-card-meta,
.training-center-card-content,
.course-meta {
  position: relative;
  z-index: 2;
}

.course-meta {
  margin: var(--spacing-md) 0;
}

.course-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--training-center-gray-medium);
}

.course-info span {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  position: relative;
  z-index: 2;
}

.card-actions .training-center-btn {
  flex: 1;
  text-align: center;
}

/* Learning Approach */
.learning-approach {
  background: var(--training-center-white);
}

.approach-list {
  list-style: none;
  padding: 0;
}

.approach-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.approach-text h4 {
  margin-bottom: var(--spacing-xs);
  color: var(--training-center-gray-dark);
}

.approach-text p {
  margin-bottom: 0;
}

.approach-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.learning-approach-image {
  width: 500px;
  height: 400px;
  border-radius: 0px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.learning-approach-image:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Research Section */
.research-innovation {
  background: var(--training-center-gray-lighter);
}
.research-highlights {
  display: grid;
  gap: var(--spacing-xl);
}
.research-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  background: var(--training-center-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-subtle);
  justify-content: space-between;
}
.research-item.reverse-row {
  flex-direction: row-reverse;
}
.research-item.reverse-row .research-content {
  text-align: right;
  align-items: flex-end;
  margin-left: auto;
}
.research-content {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.research-image {
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 0px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-left: var(--spacing-xl);
  margin-right: var(--spacing-xl);
}
@media (max-width: 900px) {
  .research-item, .research-item.reverse-row {
    flex-direction: column !important;
    text-align: center;
  }
  .research-image {
    margin: var(--spacing-lg) 0 0 0;
    width: 100%;
    max-width: 400px;
    height: auto;
  }
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--training-center-primary) 0%, var(--training-center-primary-dark) 100%);
  color: var(--training-center-white);
}

.cta-section h2 {
  color: var(--training-center-white);
}

.cta-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
}

.cta-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

/* Footer */
.site-footer {
  background: var(--training-center-gray-dark);
  color: var(--training-center-white);
  padding: var(--spacing-xxxl) 0 var(--spacing-lg);
}

.footer-section h4 {
  color: var(--training-center-white);
  margin-bottom: var(--spacing-lg);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--training-center-white);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--training-center-white);
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.social-link:hover {
  background: var(--training-center-primary);
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  color: rgba(255, 255, 255, 0.8);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

/* Icon styles */
[class^="icon-"]::before {
  display: inline-block;
  width: 1em;
  text-align: center;
}

.icon-arrow-right::before { content: "→"; }
.icon-graduation-cap::before { content: "🎓"; }
.icon-lightbulb::before { content: "💡"; }
.icon-globe::before { content: "🌍"; }
.icon-book::before { content: "📚"; }
.icon-users::before { content: "👥"; }
.icon-chart::before { content: "📊"; }
.icon-certificate::before { content: "🏆"; }
.icon-microscope::before { content: "🔬"; }
.icon-robot::before { content: "🤖"; }
.icon-network::before { content: "🌐"; }
.icon-calendar::before { content: "📅"; }
.icon-heart::before { content: "❤️"; }
.icon-facebook::before { content: "📘"; }
.icon-twitter::before { content: "🐦"; }
.icon-linkedin::before { content: "💼"; }
.icon-location::before { content: "📍"; }
.icon-phone::before { content: "📞"; }
.icon-email::before { content: "📧"; }
.icon-image::before { content: "🖼️"; }
</style>
