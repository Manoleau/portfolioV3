<script setup>
import { ref } from 'vue';
import educationData from '@/data/education.json';

const activeTab = ref('degrees');
const education = ref(educationData);

function setActiveTab(tab) {
  activeTab.value = tab;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short'
  }).format(date);
}
</script>

<template>
  <div class="education-app">
    <div class="tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'degrees' }" 
        @click="setActiveTab('degrees')"
      >
        Degrees
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'certifications' }" 
        @click="setActiveTab('certifications')"
      >
        Certifications
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'courses' }" 
        @click="setActiveTab('courses')"
      >
        Courses
      </button>
    </div>
    
    <div class="education-container">
      <!-- Degrees Tab -->
      <div v-if="activeTab === 'degrees'">
        <div v-if="education.degrees.length === 0" class="no-items">
          No degrees to display.
        </div>
        
        <div v-for="degree in education.degrees" :key="degree.id" class="education-card">
          <div class="education-header">
            <div class="education-title">
              <h3 class="degree-name">{{ degree.degree }}</h3>
              <h4 class="institution">{{ degree.institution }}</h4>
            </div>
            <div class="education-period">
              <div class="dates">
                {{ formatDate(degree.startDate) }} - {{ formatDate(degree.endDate) }}
              </div>
              <div class="location">{{ degree.location }}</div>
              <div class="gpa" v-if="degree.gpa">GPA: {{ degree.gpa }}</div>
            </div>
          </div>
          
          <p class="education-description">{{ degree.description }}</p>
          
          <div class="education-details">
            <div class="achievements">
              <h5>Achievements:</h5>
              <ul>
                <li v-for="(achievement, index) in degree.achievements" :key="index">
                  {{ achievement }}
                </li>
              </ul>
            </div>
            
            <div class="courses">
              <h5>Key Courses:</h5>
              <div class="course-tags">
                <span v-for="(course, index) in degree.courses" :key="index" class="course-tag">
                  {{ course }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Certifications Tab -->
      <div v-if="activeTab === 'certifications'">
        <div v-if="education.certifications.length === 0" class="no-items">
          No certifications to display.
        </div>
        
        <div v-for="cert in education.certifications" :key="cert.id" class="education-card">
          <div class="education-header">
            <div class="education-title">
              <h3 class="cert-name">{{ cert.name }}</h3>
              <h4 class="issuer">{{ cert.issuer }}</h4>
            </div>
            <div class="education-period">
              <div class="dates">
                Issued: {{ formatDate(cert.date) }}
                <span v-if="cert.expirationDate">
                  <br>Expires: {{ formatDate(cert.expirationDate) }}
                </span>
              </div>
              <div class="credential-id">ID: {{ cert.credentialId }}</div>
            </div>
          </div>
          
          <p class="education-description">{{ cert.description }}</p>
          
          <div class="cert-verify">
            <a :href="cert.credentialURL" target="_blank" class="verify-link">Verify Credential</a>
          </div>
        </div>
      </div>
      
      <!-- Courses Tab -->
      <div v-if="activeTab === 'courses'">
        <div v-if="education.courses.length === 0" class="no-items">
          No courses to display.
        </div>
        
        <div v-for="course in education.courses" :key="course.id" class="education-card">
          <div class="education-header">
            <div class="education-title">
              <h3 class="course-name">{{ course.name }}</h3>
              <h4 class="provider">{{ course.provider }}</h4>
            </div>
            <div class="education-period">
              <div class="dates">
                Completed: {{ formatDate(course.date) }}
              </div>
            </div>
          </div>
          
          <p class="education-description">{{ course.description }}</p>
          
          <div class="skills">
            <h5>Skills:</h5>
            <div class="skill-tags">
              <span v-for="(skill, index) in course.skills" :key="index" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.education-app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.tab-button {
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  border-right: 1px solid #ddd;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.tab-button:hover {
  background-color: #e0e0e0;
}

.tab-button.active {
  background-color: white;
  border-bottom: 2px solid var(--color-2);
  font-weight: bold;
}

.education-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.education-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
}

.education-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.education-title {
  flex: 1;
}

.degree-name, .cert-name, .course-name {
  margin: 0 0 4px 0;
  color: var(--color-1);
  font-size: 18px;
}

.institution, .issuer, .provider {
  margin: 0;
  color: var(--color-2);
  font-size: 16px;
  font-weight: normal;
}

.education-period {
  text-align: right;
  color: #666;
  font-size: 14px;
}

.dates {
  font-weight: bold;
}

.location, .credential-id {
  margin-top: 4px;
}

.gpa {
  margin-top: 4px;
  font-weight: bold;
  color: var(--color-2);
}

.education-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.education-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievements h5, .courses h5, .skills h5 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #444;
}

.achievements ul {
  margin: 0;
  padding-left: 20px;
}

.achievements li {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.course-tags, .skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.course-tag, .skill-tag {
  background-color: var(--color-3);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.cert-verify {
  margin-top: 16px;
}

.verify-link {
  display: inline-block;
  color: var(--color-2);
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
}

.verify-link:hover {
  text-decoration: underline;
}

.no-items {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
}
</style>