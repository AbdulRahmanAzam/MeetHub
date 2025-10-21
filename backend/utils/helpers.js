import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Generate random invite code
export const generateInviteCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Check if time slots overlap
export const checkTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// Find best meeting time based on availability
export const findBestMeetingSlots = (members, duration = 60) => {
  // This is a simplified version
  // In production, you'd want more sophisticated algorithm
  const slots = [];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (let day = 1; day <= 5; day++) { // Mon-Fri
    const daySlots = {
      day: daysOfWeek[day],
      dayOfWeek: day,
      timeSlots: []
    };
    
    // Check common available times (simplified)
    const commonTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    
    for (const time of commonTimes) {
      let availableCount = 0;
      
      members.forEach(member => {
        if (member.availability && member.availability.length > 0) {
          const dayAvailability = member.availability.find(
            a => a.dayOfWeek === day && a.status === 'available'
          );
          
          if (dayAvailability) {
            // Check if time falls within availability window
            const [hours, minutes] = time.split(':');
            const timeValue = parseInt(hours) * 60 + parseInt(minutes);
            
            const [startHours, startMinutes] = dayAvailability.startTime.split(':');
            const startValue = parseInt(startHours) * 60 + parseInt(startMinutes);
            
            const [endHours, endMinutes] = dayAvailability.endTime.split(':');
            const endValue = parseInt(endHours) * 60 + parseInt(endMinutes);
            
            if (timeValue >= startValue && timeValue + duration <= endValue) {
              availableCount++;
            }
          }
        }
      });
      
      if (availableCount > 0) {
        daySlots.timeSlots.push({
          time,
          availableCount,
          totalMembers: members.length,
          percentage: (availableCount / members.length) * 100
        });
      }
    }
    
    if (daySlots.timeSlots.length > 0) {
      slots.push(daySlots);
    }
  }
  
  // Sort by availability percentage and return top 3
  const allSlots = [];
  slots.forEach(day => {
    day.timeSlots.forEach(slot => {
      allSlots.push({
        day: day.day,
        dayOfWeek: day.dayOfWeek,
        ...slot
      });
    });
  });
  
  return allSlots
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
