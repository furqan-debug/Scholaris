import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useAssignments(sectionId: string) {
  return useQuery({
    queryKey: ['assignments', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase.from('assignments').select('*').eq('section_id', sectionId).order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!sectionId,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAssignment: { section_id: string; title: string; max_score: number; weight_percentage: number }) => {
      const { data, error } = await supabase.from('assignments').insert([newAssignment]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', variables.section_id] });
    },
  });
}

export function useSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ['submissions', assignmentId],
    queryFn: async () => {
      const { data, error } = await supabase.from('submissions').select('*, student:profiles(*)').eq('assignment_id', assignmentId);
      if (error) throw error;
      return data;
    },
    enabled: !!assignmentId,
  });
}

export function useSubmitScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSubmission: { assignment_id: string; student_id: string; score: number }) => {
      // Upsert score
      const { data, error } = await supabase.from('submissions').upsert([newSubmission], { onConflict: 'assignment_id,student_id' }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.assignment_id] });
      // The trigger will recalculate final grade, so invalidate enrollments and gpa
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['gpa'] });
    },
  });
}
