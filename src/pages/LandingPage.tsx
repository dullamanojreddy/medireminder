import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Globe, Settings, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import MedicalIllustration from "../components/MedicalIllustration";
import Modal from "../components/Modal";

interface FeatureDetail {
  title: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
}

export default function LandingPage() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);

  const features: FeatureDetail[] = [
    {
      title: "Medicine Reminders",
      description: "Direct notifications through both WhatsApp messages and telephone voice calls based on your schedule.",
      longDescription: "Our system integrates directly with telephony carriers and WhatsApp API to ensure your alert is seen immediately. Choose between automated friendly reminders or direct telephone calls that read out your custom pill names and dosages to ensure compliance.",
      icon: <Bell className="w-6 h-6 text-primary" />,
    },
    {
      title: "Multiple Languages",
      description: "Receive reminders in your preferred local tongue: English, Hindi, Telugu, Tamil, Kannada, or Marathi.",
      longDescription: "Communication is most effective in your mother tongue. We support six key Indian languages to remove any literacy or technical barriers, providing automated call messages translated perfectly and pronounced clearly.",
      icon: <Globe className="w-6 h-6 text-primary" />,
    },
    {
      title: "Simple Setup",
      description: "No complex dashboards. Simply enter your medication name, frequency, and custom hours to get started.",
      longDescription: "Set up reminders for your parents or yourself in less than two minutes. A clean, streamlined input flow asks only the essential questions: what you need to take, when, and how you want to be notified.",
      icon: <Settings className="w-6 h-6 text-primary" />,
    },
    {
      title: "Reliable Notifications",
      description: "Redundant cellular routing with delivery confirmations to give your family absolute peace of mind.",
      longDescription: "If a WhatsApp notification is not received, the system can fallback to phone call reminders or alert a designated family member if a critical dose confirmation is missed. Rest easy knowing your health is fully monitored.",
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6 md:gap-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-primary px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Introducing MedReminder+ v1.0
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-text-primary leading-[1.1] tracking-tight">
            Never Miss Your <br className="hidden sm:inline" />
            <span className="text-primary">Medicine</span> Again
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-[580px]">
            Simple medicine reminders through WhatsApp and automated phone calls. Keep your loved ones safe and healthy with no complex apps to learn.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
            <Link id="hero-get-started-link" to="/register" className="w-full sm:w-auto">
              <Button id="hero-get-started-btn" variant="primary" fullWidth className="group gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link id="hero-login-link" to="/login" className="w-full sm:w-auto">
              <Button id="hero-login-btn" variant="outline" fullWidth>
                Login
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-5 flex justify-center">
          <MedicalIllustration />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="flex flex-col gap-10 md:gap-12">
        <div className="text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Designed for Simplicity & Reliability
          </h2>
          <p className="text-base md:text-lg text-text-secondary max-w-[620px]">
            We removed all the bloat to focus entirely on ensuring your medication schedule is respected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="cursor-pointer"
              onClick={() => setSelectedFeature(feature)}
            >
              <Card
                id={`feature-card-${idx}`}
                hoverable
                className="h-full flex flex-col gap-4 text-left border-gray-100 hover:border-blue-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center justify-between">
                  {feature.title}
                  <span className="text-xs text-primary font-semibold group-hover:underline">Learn more</span>
                </h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Detail Modal */}
      <Modal
        id="feature-detail-modal"
        isOpen={selectedFeature !== null}
        onClose={() => setSelectedFeature(null)}
        title={selectedFeature?.title || ""}
      >
        {selectedFeature && (
          <div className="flex flex-col gap-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center self-start mb-1">
              {selectedFeature.icon}
            </div>
            
            <p className="text-base text-text-primary leading-relaxed">
              {selectedFeature.longDescription}
            </p>

            <div className="mt-4 flex items-center gap-3 bg-green-50 text-success border border-green-100 p-4 rounded-input text-sm font-semibold">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Fully integrated and ready for active caregiver use.</span>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                id="close-feature-modal"
                variant="secondary"
                onClick={() => setSelectedFeature(null)}
              >
                Got It
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
