import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { supabase, Profile, Booking } from '../lib/supabase';
import { AdminProfileForm } from '../components/Admin/AdminProfileForm';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Clock,
  ExternalLink,
  LayoutDashboard,
  Settings,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function AdminDashboard() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('add'); // Default to 'add' as requested for separate upload page

  const fetchDashboardData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const [profilesRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      if (profilesRes.data) setProfiles(profilesRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { 
      label: t.admin.totalProfessionals, 
      value: profiles.filter(p => p.role === 'professional').length, 
      icon: Users, 
      color: 'bg-emerald-100 text-emerald-600' 
    },
    { 
      label: t.admin.verifiedBadge, 
      value: profiles.filter(p => p.is_verified).length, 
      icon: ShieldCheck, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      label: t.admin.totalBookings, 
      value: bookings.length, 
      icon: CreditCard, 
      color: 'bg-amber-100 text-amber-600' 
    },
    { 
      label: 'Published', 
      value: profiles.filter(p => p.is_approved).length, 
      icon: TrendingUp, 
      color: 'bg-purple-100 text-purple-600' 
    },
  ];

  if (loading && profiles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-5 h-[600px] rounded-3xl" />
          <Skeleton className="lg:col-span-7 h-[600px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3 text-emerald-600">
              <LayoutDashboard className="h-6 w-6" />
              <span className="font-black uppercase tracking-widest text-sm">Admin System</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-emerald-900 tracking-tight">{t.admin.title}</h1>
            <p className="text-emerald-700/70 text-lg mt-2 font-medium">Manage the Hulu-Work ecosystem and verify professionals.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('add')}
              className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all text-emerald-900"
            >
              <UserPlus className="h-5 w-5" />
              {t.admin.uploadNew}
            </button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl border border-emerald-50 shadow-sm">
            <TabsTrigger value="add" className="rounded-xl px-8 py-3 font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Upload Professional
            </TabsTrigger>
            <TabsTrigger value="overview" className="rounded-xl px-8 py-3 font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Platform Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl px-8 py-3 font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-emerald-900">Upload New Professional Profile</h2>
                <p className="text-slate-500">Fill in the details below to add a new verified professional to the marketplace.</p>
              </div>
              <AdminProfileForm onSuccess={() => { fetchDashboardData(); setActiveTab('overview'); }} />
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-none shadow-xl shadow-emerald-900/5 rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>
                          <stat.icon className="h-7 w-7" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-black text-emerald-600 uppercase tracking-tighter">Live</span>
                          <ChevronRight className="h-5 w-5 text-slate-200 mt-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black text-emerald-900">{stat.value}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-2xl shadow-emerald-900/5 overflow-hidden rounded-[2rem]">
                <CardHeader className="border-b border-slate-50 bg-white/50 p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-xl">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black text-emerald-900">{t.admin.recentBookings}</CardTitle>
                        <CardDescription>Latest platform transactions</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 px-4 py-1.5 font-bold rounded-full">View All</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-slate-50/50">
                        <TableHead className="pl-8">Transaction</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right pr-8">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.length > 0 ? (
                        bookings.map((booking) => (
                          <TableRow key={booking.id} className="hover:bg-emerald-50/30 transition-colors border-slate-50">
                            <TableCell className="font-mono text-xs text-slate-500 pl-8">#{booking.id.slice(0, 8)}</TableCell>
                            <TableCell className="font-black text-emerald-900">{booking.amount} ETB</TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold">Success</Badge>
                            </TableCell>
                            <TableCell className="text-right pr-8 text-slate-500 text-sm font-medium">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-48 text-center text-slate-400">
                            <div className="flex flex-col items-center gap-2">
                              <AlertCircle className="h-10 w-10 opacity-20" />
                              <p className="font-bold uppercase tracking-widest text-xs">No transactions yet</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-none shadow-2xl shadow-emerald-900/5 overflow-hidden rounded-[2rem]">
                <CardHeader className="border-b border-slate-50 bg-white/50 p-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-emerald-900">Latest Profiles</CardTitle>
                      <CardDescription>Recently added professionals</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-slate-50/50">
                        <TableHead className="pl-8">Professional</TableHead>
                        <TableHead>Trade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right pr-8">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.filter(p => p.role === 'professional').slice(0, 5).map((profile) => (
                        <TableRow key={profile.id} className="hover:bg-emerald-50/30 transition-colors border-slate-50">
                          <TableCell className="pl-8">
                            <div className="flex items-center gap-3">
                              <img src={profile.image_url} alt="" className="h-10 w-10 rounded-xl object-cover ring-2 ring-emerald-50" />
                              <span className="font-bold text-emerald-900">{profile.name || profile.full_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600 font-medium">{profile.profession}</TableCell>
                          <TableCell>
                            {profile.is_approved ? (
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold">Live</Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-400 font-bold border-slate-200">Draft</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <button className="text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                              <ExternalLink className="h-5 w-5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl rounded-[2rem] p-12 text-center">
              <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="h-12 w-12 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-black text-emerald-900 mb-4">System Settings</h2>
              <p className="text-slate-500 max-w-md mx-auto">Configuration options for the Hulu-Work platform will appear here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}