"use client";

import React, { useState, FC, useEffect } from "react";
import ProfileComps from "@/components/ProfileComps";
import { useSession } from "@/lib/auth-client";
import {
  ChevronRight,
  Zap,
  Shield,
  Cpu,
  ArrowRight,
  Play,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ModeToggle } from "@/components/themeTogle";
import { useRouter } from "next/navigation";

interface HeaderProps {
  session: { user: { name: string } } | null;
  status: string;
  handleSignOut: () => void;
  handleLogin: () => void;
}

const Header: FC<HeaderProps> = ({ session, status, handleSignOut, handleLogin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-b border-gray-300 dark:border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-2xl border border-gray-300 dark:border-gray-800">
                <Cpu className="w-6 h-6 text-black dark:text-white" />
              </div>
              <div className="absolute -inset-1 bg-white/10 rounded-xl blur opacity-30 animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold font-mono text-black dark:text-white">
              Beam Robotics
            </span>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
            >
              About
            </a>
            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
            >
              Dashboard
            </Link>



          </div>

          <div className="flex items-center space-x-4">
            {status === "loading" ? (
                <Skeleton className="h-6 w-20 rounded-md animate-pulse"/> // Or a spinner component
              ) : status === "authenticated" ? (
                <ProfileComps />
              ) : (
                <>
                  <ModeToggle />
                  <Link href="/team" passHref>
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Meet the Team
                    </Button>
                  </Link>
            <Button onClick={handleLogin} variant="default">
              Login
            </Button>
                </>
              )}
          </div>
        </nav>
      </div>
    </header>
  );
};

// ThemeToggle component removed in favor of global ModeToggle

import { ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Button: FC<
  ComponentProps<"button"> & {
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "default" | "lg";
  }
> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50 disabled:opacity-50 group";

  const variants = {
    default:
      "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black hover:dark:bg-gray-200 shadow-xl hover:shadow-2xl hover:shadow-black/25 dark:hover:shadow-white/25 hover:scale-105 active:scale-95",
    outline:
      "border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5 backdrop-blur-sm",
    ghost:
      "text-black/70 hover:text-black hover:bg-black/10 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    default: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const FeatureCard: FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  bgClass: string;
}> = ({ icon, title, description, bgClass }) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gray-900/10 dark:bg-white/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-gray-300 dark:border-gray-800 rounded-2xl p-8 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-500 hover:scale-105">
        <div
          className={`w-16 h-16 ${bgClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
        <div className="mt-6">
          <button className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-medium flex items-center group">
            Learn More
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: FC<{ number: string; label: string }> = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
      {number}
    </div>
    <div className="text-gray-600 font-medium dark:text-gray-400">{label}</div>
  </div>
);

const Footer = () => {
  return (
    <footer className="relative py-16 px-6 border-t border-gray-300 dark:border-gray-800">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-900 rounded-xl flex items-center justify-center border border-gray-300 dark:border-gray-800">
                <span className="text-gray-900 dark:text-white font-black text-sm">BR</span>
              </div>
              <span className="text-xl font-black text-gray-900 dark:text-white">
                Beam Robotics
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
              Pioneering the future of autonomous systems and intelligent
              automation.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Product</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Analytics
              </Link>
              <Link
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                API
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Company</h3>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Careers
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                News
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h3>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Support
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Community
              </a>
              <a
                href="#"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Blog
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-800 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          © 2024 Beam Robotics. All rights reserved. | Engineered for the
          future.
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleSignOut = () => {
    // Implement actual sign out logic here
  };

  const handleLogin = () => {
    router.push('/login');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden dark:bg-black dark:text-white transition-colors duration-500 scroll-smooth">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,white,transparent)] dark:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gray-400 dark:bg-gray-900 rounded-full blur-2xl animate-pulse opacity-100 dark:opacity-70"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gray-400 dark:bg-gray-900 rounded-full blur-2xl animate-pulse opacity-100 dark:opacity-70"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gray-400 dark:bg-gray-900 rounded-full blur-2xl animate-pulse opacity-100 dark:opacity-70"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-6 h-6 bg-gray-400 dark:bg-gray-700 rounded-full blur-sm opacity-90 dark:opacity-30 pointer-events-none transition-all duration-300 ease-out animate-pulse"
          style={{
            left: mousePosition.x - 12,
            top: mousePosition.y - 12,
          }}
        ></div>
      </div>

      <Header
        session={session}
        status={isPending ? "loading" : session ? "authenticated" : "unauthenticated"}
        handleSignOut={handleSignOut}
        handleLogin={handleLogin}
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center">


              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
                <span className="block bg-gradient-to-r from-black via-gray-600 to-black dark:from-white dark:via-gray-400 dark:to-white bg-clip-text text-transparent animate-gradient-text">
                NEXT-GEN
              </span>
                <span
                    className="block bg-gradient-to-r from-black via-gray-600 to-black dark:from-white dark:via-gray-400 dark:to-white bg-clip-text text-transparent animate-gradient-text"
                    style={{ animationDelay: "0.5s" }}
                  >
                  ROBOTICS
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
                Experience the convergence of artificial intelligence and
                robotics.
                <span className="text-gray-900 dark:text-white font-semibold">
                  {" "}
                  Beam Robotics
                </span>{" "}
                delivers autonomous solutions that redefine what's possible in
                automation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                {isPending ? (
                  <div>Loading button...</div> // Or a spinner component
                ) : (
                  <Button
                    size="lg"
                    onClick={() => router.push('/dashboard')}
                    className="text-lg px-12 py-6 font-bold shadow-2xl shadow-gray-900/25 dark:shadow-white/25"
                  >
                    <span>
                      {session?.user ? "Enter Dashboard" : "Start Journey"}
                    </span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-12 py-6 font-bold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  <span>Watch Demo</span>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <StatCard number="99.9%" label="Uptime" />
                <StatCard number="10x" label="Faster Processing" />
                <StatCard number="500+" label="Deployments" />
                <StatCard number="24/7" label="Support" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 backdrop-blur-xl mb-6">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  CORE CAPABILITIES
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Engineered for
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-600 via-gray-900 to-gray-600 dark:from-gray-400 dark:via-white dark:to-gray-400 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Revolutionary technology stack designed for the most demanding
                industrial applications
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Cpu className="w-8 h-8 text-gray-900 dark:text-white" />}
                title="Quantum-Enhanced AI"
                description="Advanced neural networks powered by quantum computing algorithms for unprecedented decision-making capabilities and real-time adaptation."
                bgClass="bg-gray-200 dark:bg-gray-800"
              />

              <FeatureCard
                icon={<Zap className="w-8 h-8 text-gray-900 dark:text-white" />}
                title="Lightning Performance"
                description="Ultra-low latency processing with edge computing integration. Process millions of data points per second with microsecond response times."
                bgClass="bg-gray-200 dark:bg-gray-800"
              />

              <FeatureCard
                icon={<Shield className="w-8 h-8 text-gray-900 dark:text-white" />}
                title="Military-Grade Security"
                description="End-to-end encryption, blockchain verification, and multi-layer security protocols ensure your operations remain completely secure."
                bgClass="bg-gray-200 dark:bg-gray-800"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-block px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 backdrop-blur-xl">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    OUR VISION
                  </span>
                </div>

                <h2 className="text-5xl md:text-6xl font-black leading-tight">
                  <span className="text-gray-900 dark:text-white">Shaping the</span>
                  <br />
                  <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-white dark:via-gray-400 dark:to-white bg-clip-text text-transparent">
                    Automated Universe
                  </span>
                </h2>

                <p className="text-xl text-gray-400 leading-relaxed">
                  We're not just building robots – we're crafting the foundation
                  of tomorrow's intelligent ecosystem. Every line of code, every
                  circuit, every algorithm is designed to push humanity forward
                  into an age of unprecedented capability.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="font-bold">
                    <span>Explore Our Story</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="lg" className="font-bold">
                    Meet the Team
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square relative">
                  {/* Central hub */}
                  <div className="absolute inset-1/4 bg-gray-900 rounded-full backdrop-blur-xl border border-gray-800 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/50">
                      <Cpu className="w-8 h-8 text-black" />
                    </div>
                  </div>

                  {/* Orbiting elements */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center animate-pulse">
                    <div className="w-6 h-6 bg-white/20 rounded-md"></div>
                  </div>
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center animate-pulse"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-md"></div>
                  </div>
                  <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center animate-pulse"
                    style={{ animationDelay: "2s" }}
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-md"></div>
                  </div>
                  <div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center animate-pulse"
                    style={{ animationDelay: "3s" }}
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-md"></div>
                  </div>

                  {/* Connecting lines */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 400"
                  >
                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#d1d5db"
                          stopOpacity="0.6"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 200 50 L 200 200 L 50 200 L 200 200 L 350 200 L 200 200 L 200 350"
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      fill="none"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">Ready to</span>
              <br />
              <span className="bg-gradient-to-r from-black via-gray-600 to-black dark:from-white dark:via-gray-400 dark:to-white bg-clip-text text-transparent animate-gradient-text">
                Transform Reality?
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the revolution. Connect with our team of engineers and
              visionaries to discover how Beam Robotics can elevate your
              operations beyond imagination.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="text-lg px-12 py-6 font-bold shadow-2xl shadow-white/25"
              >
                <span>Contact Our Team</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-12 py-6 font-bold"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite !important;
          background-clip: text;
          -webkit-background-clip: text;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out !important;
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
