import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export function useAttendance(date: Date) {
  return useQuery({
    queryKey: ['attendance', format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          student:profiles(first_name, last_name),
          class:classes(name)
        `)
        .eq('date', formattedDate);

      if (error) throw error;
      return data as any[];
    },
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLog: { class_id: string; student_id: string; status: string; date: string; notes?: string }) => {
      const { data, error } = await supabase.from('attendance').upsert([newLog], { onConflict: 'class_id,student_id,date' }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', variables.date] });
    },
  });
}
