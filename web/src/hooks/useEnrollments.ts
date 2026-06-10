import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useStudentEnrollments(studentId: string) {
  return useQuery({
    queryKey: ['enrollments', studentId],
    queryFn: async () => {
      const { data, error } = await supabase.from('enrollments').select('*, section:sections(*, course:courses(*))').eq('student_id', studentId).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });
}

export function useStudentGPA(studentId: string) {
  return useQuery({
    queryKey: ['gpa', studentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_student_gpa', { p_student_id: studentId });
      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });
}

export function useSectionEnrollments(sectionId: string) {
  return useQuery({
    queryKey: ['enrollments', 'section', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase.from('enrollments').select('*, student:profiles(id, first_name, last_name, roll_number)').eq('section_id', sectionId).order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!sectionId,
  });
}

export function useEnrollStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollment: { section_id: string; student_id: string; }) => {
      const { data, error } = await supabase.from('enrollments').insert([enrollment]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', variables.student_id] });
      queryClient.invalidateQueries({ queryKey: ['recent_activity'] });
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['recent_activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, student:profiles(first_name, last_name), section:sections(course:courses(code))')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });
}
