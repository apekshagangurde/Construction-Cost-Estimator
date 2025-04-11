import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ruler, Building2, LineChart, ArrowDownToLine, Lightbulb } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Accurate Construction Cost Estimation Made Simple
                </h1>
                <p className="mt-6 text-lg text-gray-600">
                  BuildCost Estimator helps civil engineers and project managers estimate construction costs accurately, reduce financial risks, and optimize budgets.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/project-history">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      View Projects
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-6 -left-6 h-64 w-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute -bottom-8 -right-4 h-64 w-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 h-64 w-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <div className="bg-white rounded-lg shadow-xl p-8">
                      <Ruler className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900">Cost Estimation Tool</h3>
                      <p className="mt-2 text-gray-600">Calculate accurate cost estimates for any construction project</p>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-xl font-bold text-primary">$250/ft²</p>
                          <p className="text-xs text-gray-500">Avg. Commercial</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-xl font-bold text-primary">$1.2M</p>
                          <p className="text-xs text-gray-500">Typical Project</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Our construction cost estimator provides detailed breakdowns, optimization suggestions, and comprehensive reports.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Detailed Project Input</h3>
                <p className="mt-2 text-gray-600">
                  Enter project dimensions, select materials, and specify labor details to generate accurate estimates.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
                <p className="mt-2 text-gray-600">
                  Visualize cost distribution across materials, labor, equipment, and overhead with interactive charts.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Optimization Suggestions</h3>
                <p className="mt-2 text-gray-600">
                  Receive intelligent recommendations for alternative materials and design tweaks to reduce costs.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <ArrowDownToLine className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Report Generation</h3>
                <p className="mt-2 text-gray-600">
                  Download comprehensive PDF reports with cost estimation details and optimization recommendations.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow transition-shadow md:col-span-2">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                      <Building2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Start Your Cost Estimation Today</h3>
                    <p className="mt-2 text-gray-600">
                      Streamline your construction planning process with our comprehensive cost estimation tool.
                    </p>
                    <div className="mt-4">
                      <Link href="/dashboard">
                        <Button>Get Started</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Ready to optimize your construction costs?
                <span className="block text-lg font-normal mt-2">
                  Get started with our cost estimation tool today.
                </span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link href="/dashboard">
                    <Button className="bg-white text-primary hover:bg-gray-100 hover:text-primary">
                      Start Estimating
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
