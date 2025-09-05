import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Star, MessageSquare, Shield } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const features = [
    { icon: Users, title: 'Expert Network', desc: 'Connect with verified professionals' },
    { icon: Star, title: 'Quality Assured', desc: 'Rated and reviewed by real users' },
    { icon: MessageSquare, title: 'Direct Communication', desc: 'Built-in messaging and workspace' },
    { icon: Shield, title: 'Secure Platform', desc: 'Protected transactions and data' }
  ];

  const categories = [
    'Business Consulting', 'Technology', 'Marketing', 'Finance', 
    'Legal Services', 'Design', 'Healthcare', 'Education'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68b92e76ce9844a030a6f1e1_1756973500450_0e55cfd6.webp"
            alt="GENOVA Platform"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
                Connect with
                <span className="text-blue-600 block">Expert Professionals</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                GENOVA is the premier platform connecting businesses and individuals 
                with verified experts across all industries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="text-lg px-8 py-6"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
              >
                Browse Experts
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10,000+</div>
                <div className="text-sm text-gray-600">Verified Experts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50,000+</div>
                <div className="text-sm text-gray-600">Successful Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">4.9/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GENOVA?</h2>
          <p className="text-lg text-gray-600">Everything you need for successful expert collaboration</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Expert Categories</h2>
            <p className="text-lg text-gray-600">Find professionals in every field</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-gray-900">{category}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of professionals and businesses on GENOVA</p>
          <div className="space-x-4">
            <Button 
              onClick={onGetStarted}
              variant="secondary" 
              size="lg" 
              className="text-lg px-8 py-6"
            >
              Join as Expert
            </Button>
            <Button 
              onClick={onGetStarted}
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Find an Expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};