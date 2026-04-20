const { store, insert } = require('./memoryStore');

const SEED_DOCTORS = [
  {
    name: 'Dr. Sarah Mitchell', specialization: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology), FACC', experience: 15,
    hospital: 'HealthHub Heart Center', location: 'New York, NY',
    consultationFee: 250, rating: 4.9, reviewCount: 312,
    availability: 'available',
    availableSlots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
    languages: ['English', 'Spanish'],
    about: 'Board-certified cardiologist with 15 years of experience in interventional cardiology and heart failure management.',
    imageUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah'
  },
  {
    name: 'Dr. James Okafor', specialization: 'Neurologist',
    qualification: 'MBBS, MD (Neurology), PhD', experience: 12,
    hospital: 'HealthHub Brain & Spine Institute', location: 'Chicago, IL',
    consultationFee: 220, rating: 4.8, reviewCount: 245,
    availability: 'available',
    availableSlots: ['10:00 AM', '1:00 PM', '3:00 PM'],
    languages: ['English', 'French'],
    about: 'Leading neurologist specializing in stroke management, epilepsy, and neurodegenerative diseases.',
    imageUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=james'
  },
  {
    name: 'Dr. Priya Sharma', specialization: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)', experience: 8,
    hospital: 'HealthHub Skin & Wellness Clinic', location: 'San Francisco, CA',
    consultationFee: 180, rating: 4.7, reviewCount: 198,
    availability: 'available',
    availableSlots: ['9:30 AM', '11:30 AM', '2:30 PM', '4:30 PM'],
    languages: ['English', 'Hindi'],
    about: 'Certified dermatologist with expertise in medical and cosmetic dermatology, acne, eczema, and psoriasis.',
    imageUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=priya'
  },
  {
    name: 'Dr. Robert Chen', specialization: 'Orthopedist',
    qualification: 'MBBS, MS (Orthopedics), FACS', experience: 18,
    hospital: 'HealthHub Bone & Joint Center', location: 'Los Angeles, CA',
    consultationFee: 200, rating: 4.9, reviewCount: 421,
    availability: 'busy',
    availableSlots: ['3:00 PM', '5:00 PM'],
    languages: ['English', 'Mandarin'],
    about: 'Highly experienced orthopedic surgeon specializing in joint replacement, sports injuries, and spine surgery.',
    imageUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=robert'
  },
  {
    name: 'Dr. Amina Hassan', specialization: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics), FAAP', experience: 10,
    hospital: "HealthHub Children's Hospital", location: 'Houston, TX',
    consultationFee: 150, rating: 4.8, reviewCount: 367,
    availability: 'available',
    availableSlots: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM'],
    languages: ['English', 'Arabic'],
    about: 'Compassionate pediatrician dedicated to the health of children from newborns to adolescents.',
    imageUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=amina'
  },
  {
    name: 'Dr. Michael Torres', specialization: 'Gastroenterologist',
    qualification: 'MBBS, MD (Gastroenterology)', experience: 14,
    hospital: 'HealthHub Digestive Health Center', location: 'Miami, FL',
    consultationFee: 210, rating: 4.6, reviewCount: 189,
    availability: 'available',
    availableSlots: ['9:00 AM', '11:00 AM', '3:00 PM'],
    languages: ['English', 'Spanish'],
    about: 'Specializes in digestive disorders including IBS, Crohn\'s disease, liver conditions, and endoscopic procedures.',
    imageUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=michael'
  },
  {
    name: 'Dr. Emily Watson', specialization: 'Psychiatrist',
    qualification: 'MBBS, MD (Psychiatry)', experience: 9,
    hospital: 'HealthHub Mental Wellness Center', location: 'Seattle, WA',
    consultationFee: 190, rating: 4.9, reviewCount: 276,
    availability: 'available',
    availableSlots: ['10:00 AM', '1:00 PM', '4:00 PM'],
    languages: ['English'],
    about: 'Compassionate psychiatrist specializing in anxiety, depression, PTSD, and bipolar disorder using evidence-based therapies.',
    imageUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=emily'
  },
  {
    name: 'Dr. Raj Patel', specialization: 'Endocrinologist',
    qualification: 'MBBS, MD (Endocrinology), FACE', experience: 16,
    hospital: 'HealthHub Diabetes & Hormone Center', location: 'Boston, MA',
    consultationFee: 230, rating: 4.7, reviewCount: 203,
    availability: 'offline',
    availableSlots: [],
    languages: ['English', 'Hindi', 'Gujarati'],
    about: 'Leading endocrinologist with expertise in diabetes management, thyroid disorders, and hormonal imbalances.',
    imageUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=raj'
  }
];

const seedDoctors = () => {
  if (store.doctors.length === 0) {
    SEED_DOCTORS.forEach(d => insert('doctors', d));
    console.log('✅ Doctors seeded (in-memory)');
  }
};

module.exports = { seedDoctors };
