
import React from 'react';
import { motion } from 'framer-motion';
import { PortfolioData, PortfolioTheme, SocialLink } from '../types';

interface PortfolioPreviewProps {
  data: PortfolioData;
  theme: PortfolioTheme;
  photoUrl: string | null;
}

const SocialButton: React.FC<{ social: SocialLink }> = ({ social }) => {
  const getBrandStyles = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return 'bg-[#0077B5] text-white hover:bg-[#005a8a]';
    if (p.includes('github')) return 'bg-[#333] text-white hover:bg-[#000]';
    if (p.includes('twitter') || p.includes(' x ')) return 'bg-black text-white hover:bg-slate-800';
    if (p.includes('instagram')) return 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white';
    if (p.includes('portfolio') || p.includes('web')) return 'bg-indigo-600 text-white';
    return 'bg-slate-200 text-slate-700 hover:bg-slate-300';
  };

  const getEmoji = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return '🔗';
    if (p.includes('github')) return '🐙';
    if (p.includes('twitter') || p.includes(' x ')) return '🐦';
    if (p.includes('instagram')) return '📸';
    return '🌐';
  };

  return (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      href={social.url}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${getBrandStyles(social.platform)}`}
    >
      <span>{getEmoji(social.platform)}</span>
      <span className="capitalize">{social.platform}</span>
    </motion.a>
  );
};

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ data, theme, photoUrl }) => {
  const avatar = photoUrl || `https://picsum.photos/seed/${data.name}/400/400`;

  const themeStyles = {
    [PortfolioTheme.MODERN]: {
      container: "bg-white text-slate-900",
      accent: "text-indigo-600",
      bgAccent: "bg-indigo-600 text-white",
      card: "bg-slate-50 border border-slate-200",
      heading: "font-sans font-bold",
    },
    [PortfolioTheme.CREATIVE]: {
      container: "bg-orange-50 text-slate-900",
      accent: "text-orange-600",
      bgAccent: "bg-orange-600 text-white",
      card: "bg-white shadow-xl shadow-orange-100/50 rounded-2xl",
      heading: "font-serif italic",
    },
    [PortfolioTheme.MINIMAL]: {
      container: "bg-white text-black",
      accent: "text-neutral-500",
      bgAccent: "bg-black text-white",
      card: "bg-white border-b border-black rounded-none",
      heading: "font-sans font-light tracking-tighter",
    },
    [PortfolioTheme.DARK_TECH]: {
      container: "bg-slate-950 text-slate-300",
      accent: "text-emerald-400",
      bgAccent: "bg-emerald-500 text-slate-950",
      card: "bg-slate-900 border border-slate-800",
      heading: "font-mono",
    }
  };

  const style = themeStyles[theme];

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div id="portfolio-content" className={`w-full min-h-screen p-4 md:p-12 transition-all duration-500 ${style.container}`}>
      {/* Hero Section */}
      <motion.header 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideUp}
        className="max-w-5xl mx-auto mb-20 flex flex-col md:flex-row items-center gap-12"
      >
        <div className="relative">
          <motion.div 
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`w-48 h-48 rounded-full overflow-hidden border-4 ${style.accent.replace('text', 'border')} shadow-2xl`}
          >
            <img src={avatar} alt={data.name} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`absolute -bottom-2 -right-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${style.bgAccent}`}
          >
            Open to Work 🟢✨
          </motion.div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-5xl md:text-7xl mb-4 ${style.heading}`}
          >
            {data.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-xl md:text-2xl mb-6 font-medium ${style.accent}`}
          >
            {data.title}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg opacity-80 leading-relaxed max-w-2xl"
          >
            {data.tagline}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start items-center"
          >
            <button className={`px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-xl ${style.bgAccent}`}>
              Get In Touch ✉️
            </button>
            <div className="flex flex-wrap gap-3">
              {data.contact.socials.map((social, idx) => (
                <SocialButton key={idx} social={social} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* About Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={slideUp}
        className="max-w-5xl mx-auto mb-20"
      >
        <h2 className={`text-3xl mb-8 flex items-center gap-3 ${style.heading}`}>
          My Story 📖✨
        </h2>
        <p className="text-xl leading-relaxed opacity-90">{data.about}</p>
      </motion.section>

      {/* Skills */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-5xl mx-auto mb-20"
      >
        <h2 className={`text-3xl mb-8 flex items-center gap-3 ${style.heading}`}>
          Skill Arsenal 🛠️⚡
        </h2>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, idx) => (
            <motion.span 
              key={idx} 
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 1 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm cursor-default ${style.card}`}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* Experience & Education */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideUp}
        >
          <h2 className={`text-3xl mb-8 flex items-center gap-3 ${style.heading}`}>
            Career Path 🚀💼
          </h2>
          <div className="space-y-8">
            {data.experiences.map((exp, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-6 border-l-2 border-slate-200"
              >
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${style.bgAccent}`} />
                <h3 className="font-bold text-xl">{exp.role}</h3>
                <p className={`font-medium mb-2 ${style.accent}`}>{exp.company} • {exp.duration}</p>
                <ul className="list-disc list-inside space-y-2 opacity-80 text-sm">
                  {exp.description.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideUp}
        >
          <h2 className={`text-3xl mb-8 flex items-center gap-3 ${style.heading}`}>
            Learning 🎓📚
          </h2>
          <div className="space-y-8">
            {data.education.map((edu, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-xl shadow-sm ${style.card}`}
              >
                <h3 className="font-bold text-xl">{edu.degree}</h3>
                <p className="opacity-80">{edu.institution}</p>
                <p className={`text-sm font-bold ${style.accent}`}>{edu.year}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Projects */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-5xl mx-auto mb-20"
      >
        <h2 className={`text-3xl mb-8 flex items-center gap-3 ${style.heading}`}>
          Crafted Projects 💻✨
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.map((project, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-8 rounded-2xl flex flex-col transition-all shadow-md hover:shadow-xl ${style.card}`}
            >
              <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
              <p className="opacity-80 mb-6 flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border opacity-70`}>
                    # {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto border-t border-slate-200 pt-12 pb-24 text-center"
      >
        <p className="text-xl font-medium mb-6">Let's connect! 📧 {data.contact.email}</p>
        <div className="flex justify-center flex-wrap gap-4 mb-10">
          {data.contact.socials.map((social, idx) => (
            <SocialButton key={idx} social={social} />
          ))}
        </div>
        <p className="text-sm opacity-50">Designed with ❤️ & AI ✨ © {new Date().getFullYear()}</p>
      </motion.footer>
    </div>
  );
};

export default PortfolioPreview;
