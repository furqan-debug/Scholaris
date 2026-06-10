import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useStudentEnrollments(studentId: string) {
  return useQuery({
    queryKey: ['enrollments', studentId],
    queryFn: async () => {
      const { data, error } = await supabase.from('enrollments').select('*, course:courses(*)').eq('student_id', studentId).order('created_at', { ascending: false });
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

export function useCourseEnrollments(courseId: string) {
  return useQuery({
    queryKey: ['enrollments', 'course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from('enrollments').select('*, student:profiles(id, first_name, last_name, roll_number)').eq('course_id', courseId).order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

export function useEnrollStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollment: { course_id: string; student_id: string; semester: string }) => {
      const { data, error } = await supabase.from('enrollments').insert([enrollment]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', variables.student_id] });
    },
  });
}

export function useAssignGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; grade: string; grade_point: number; status: string }) => {
      const { data, error } = await supabase.from('enrollments').update({ grade: params.grade, grade_point: params.grade_point, status: params.status }).eq('id', params.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['gpa'] });
    },
  });
}
