import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DataStats {
  totalRegistrations: number;
  verifiedIdentities: number;
  pendingReviews: number;
  flaggedProfiles: number;
  activeUsers: number;
  pendingUsers: number;
}

interface DataContextType {
  stats: DataStats;
  refreshStats: () => Promise<void>;
  updateStats: (newStats: Partial<DataStats>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<DataStats>({
    totalRegistrations: 0,
    verifiedIdentities: 0,
    pendingReviews: 0,
    flaggedProfiles: 0,
    activeUsers: 0,
    pendingUsers: 0,
  });

  const refreshStats = async () => {
    try {
      // Fetch registration stats
      const { count: totalRegistrations } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

      const { count: verifiedIdentities } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'verified');

      const { count: pendingReviews } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: flaggedProfiles } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'flagged');

      // Fetch user stats
      const { count: activeUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: pendingUsers } = await supabase
        .from('pending_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalRegistrations: totalRegistrations || 0,
        verifiedIdentities: verifiedIdentities || 0,
        pendingReviews: pendingReviews || 0,
        flaggedProfiles: flaggedProfiles || 0,
        activeUsers: activeUsers || 0,
        pendingUsers: pendingUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStats = (newStats: Partial<DataStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  useEffect(() => {
    refreshStats();
    
    // Set up real-time subscriptions for live updates
    const registrationChannel = supabase
      .channel('registration-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'registrations' },
        () => refreshStats()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_profiles' },
        () => refreshStats()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'pending_registrations' },
        () => refreshStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationChannel);
    };
  }, []);

  return (
    <DataContext.Provider value={{ stats, refreshStats, updateStats }}>
      {children}
    </DataContext.Provider>
  );
};