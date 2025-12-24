import { ArrowRight, Globe, Zap, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function About({ onJoinMovement }: { onJoinMovement: () => void }) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-50" />
                <div className="container px-4 mx-auto relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm text-gray-300 mb-4">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Mission: Type 1
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                        Accelerating Humanity <br /> to Type 1.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        We are building the financial infrastructure for a planetary civilization.
                    </p>
                    <div className="pt-8">
                        <Button
                            size="lg"
                            onClick={onJoinMovement}
                            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
                        >
                            Join the Movement <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Background Grid/Stars effect (Simulated with CSS) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </section>

            {/* The Vision */}
            <section className="py-24 bg-black relative">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                                <Globe className="w-8 h-8 text-blue-500" />
                                The Vision
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500" />
                            <p className="text-lg text-gray-300 leading-relaxed">
                                The Kardashev Scale measures a civilization's advancement by its energy use.
                                Humanity is currently at Type 0.7—we do not yet fully harness the potential
                                of our own planet.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                <strong className="text-white">2t1</strong> (To Type 1) exists to bridge this gap.
                                We believe that money is a form of stored energy. By optimizing how every
                                individual manages this energy, we eliminate waste and inefficiency at a global scale.
                            </p>
                            <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-400">
                                "Our vision is a world where financial mastery propels humanity into a
                                true Planetary Civilization (Type 1)."
                            </blockquote>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <Card className="relative bg-black border border-white/10 p-8 h-full">
                                <CardContent className="flex items-center justify-center h-64 md:h-80">
                                    {/* Abstract graphic representing scale */}
                                    <div className="relative w-48 h-48 rounded-full border border-white/10 flex items-center justify-center">
                                        <div className="absolute w-32 h-32 rounded-full border border-blue-500/30 animate-[spin_10s_linear_infinite]" />
                                        <div className="absolute w-40 h-40 rounded-full border border-purple-500/20 animate-[spin_15s_linear_infinite_reverse]" />
                                        <div className="text-center">
                                            <div className="text-4xl font-bold">0.7</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest">Current Type</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Mission */}
            <section className="py-24 bg-zinc-900/50">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                                <Target className="w-8 h-8 text-purple-500" />
                                The Mission
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto" />
                            <p className="text-2xl font-light text-white leading-relaxed">
                                To empower every human being with the tools to master their personal economy.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="bg-black/50 border-white/10 hover:border-white/20 transition-colors">
                                <CardContent className="p-6 space-y-4">
                                    <Zap className="w-8 h-8 text-yellow-500" />
                                    <h3 className="text-xl font-bold">Unlock Potential</h3>
                                    <p className="text-gray-400">
                                        When an individual's financial needs are met and their future is secure,
                                        they are free to innovate, create, and solve the hard problems facing our species.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-black/50 border-white/10 hover:border-white/20 transition-colors">
                                <CardContent className="p-6 space-y-4">
                                    <Globe className="w-8 h-8 text-green-500" />
                                    <h3 className="text-xl font-bold">Global Impact</h3>
                                    <p className="text-gray-400">
                                        By solving finance at the individual level, we unlock the collective potential
                                        of humanity. We are building the infrastructure for a post-scarcity mindset.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Context */}
            <section className="py-24 border-t border-white/10">
                <div className="container px-4 mx-auto text-center space-y-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-2xl font-semibold">Built in Bangalore, for the World</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Registered in the technology hub of Bangalore, India, <strong>2t1</strong> is not just a fintech company;
                            we are a global movement dedicated to the advancement of the human species through economic efficiency.
                        </p>
                    </div>
                    <div className="pt-8">
                        <Button
                            size="lg"
                            onClick={onJoinMovement}
                            variant="outline"
                            className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 rounded-full transition-all"
                        >
                            Join 2t1 Today
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} 2t1 (To Type 1). All rights reserved.</p>
                <p className="mt-2">Accelerating Humanity.</p>
            </footer>
        </div>
    );
}
