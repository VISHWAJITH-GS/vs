import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';

const SKILL_CATEGORIES = {
  "Programming": ["python", "javascript", "typescript", "java", "c++", "html", "css", "react", "node.js", "django", "flask", "fastapi"],
  "Machine Learning": ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "scikit-learn", "keras"],
  "Data Engineering": ["sql", "mongodb", "pandas", "numpy", "statistics"],
  "Cloud & DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "git", "linux", "ci/cd", "terraform", "mlops"]
};

const categorizeSkills = (skills) => {
  const counts = {
    "Programming": 0,
    "Machine Learning": 0,
    "Data Engineering": 0,
    "Cloud & DevOps": 0,
    "Other Tech": 0
  };
  
  skills.forEach(skill => {
    let categorized = false;
    const lowerSkill = skill.toLowerCase();
    for (const [cat, items] of Object.entries(SKILL_CATEGORIES)) {
      if (items.includes(lowerSkill)) {
         counts[cat]++;
         categorized = true;
         break;
      }
    }
    if (!categorized) counts["Other Tech"]++;
  });
  
  return counts;
};

const SkillRadarChart = ({ matchedSkills, missingSkills }) => {
  if (!matchedSkills || !missingSkills) {
    return (
      <div className="glass-panel feature-card h-full suggestions-panel">
        <h2 className="section-title">Skill Radar</h2>
        <p className="muted-text empty-state">Run analysis to visualize skill distribution.</p>
      </div>
    );
  }
  
  const allJobSkills = [...matchedSkills, ...missingSkills];
  
  if (allJobSkills.length === 0) {
    return (
      <div className="glass-panel feature-card h-full suggestions-panel">
        <h2 className="section-title">Skill Radar</h2>
        <p className="muted-text empty-state">No skill data yet. Upload and analyze a resume to populate this chart.</p>
      </div>
    );
  }

  const requiredCounts = categorizeSkills(allJobSkills);
  const candidateCounts = categorizeSkills(matchedSkills);

  const categories = ["Programming", "Machine Learning", "Data Engineering", "Cloud & DevOps", "Other Tech"];
  
  const data = categories.map(cat => ({
    subject: cat,
    JobRequired: requiredCounts[cat],
    Candidate: candidateCounts[cat],
  }));
  
  const filteredData = data.filter(d => d.JobRequired > 0 || d.Candidate > 0);

  return (
    <div className="glass-panel feature-card h-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
      <h2 className="section-title" style={{ alignSelf: 'flex-start', width: '100%' }}>Skill Radar</h2>
      
      <div style={{ width: '100%', minWidth: 0, height: '320px', marginTop: 'auto', marginBottom: 'auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={filteredData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 'dataMax']} 
              tick={false} 
              axisLine={false} 
            />
            <Radar 
              name="Job Requirements" 
              dataKey="JobRequired" 
              stroke="var(--accent-secondary)" 
              fill="var(--accent-secondary)" 
              fillOpacity={0.3} 
            />
            <Radar 
              name="Candidate Profile" 
              dataKey="Candidate" 
              stroke="var(--accent-primary)" 
              fill="var(--accent-primary)" 
              fillOpacity={0.6} 
            />
            <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--text-primary)' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)',
                borderRadius: '8px'
              }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', marginTop: '15px' }}>
        Comparing your skill distribution against the job requirements.
      </p>
    </div>
  );
};

export default SkillRadarChart;
