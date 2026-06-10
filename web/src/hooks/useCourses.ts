import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*, teacher:profiles(id, first_name, last_name)').order('code');
      if (error) throw error;
      return data;
    },
  });
}

export function useCoursePrerequisites(courseId: string) {
  return useQuery({
    queryKey: ['prerequisites', courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from('course_prerequisites').select('*, prerequisite:courses(*)').eq('course_id', courseId);
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCourse: { code: string; name: string; credits: number; description: string; teacher_id: string | null; prerequisites: string[] }) => {
      const { prerequisites, ...courseData } = newCourse;
      
      const { data: course, error } = await supabase.from('courses').insert([courseData]).select().single();
      if (error) throw error;

      if (prerequisites && prerequisites.length > 0) {
        const prereqData = prerequisites.map(pId => ({ course_id: course.id, prerequisite_id: pId }));
        const { error: pError } = await supabase.from('course_prerequisites').insert(prereqData);
        if (pError) throw pError;
      }

      return course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useSections(courseId?: string) {
  return useQuery({
    queryKey: ['sections', courseId],
    queryFn: async () => {
      let query = supabase.from('sections').select('*, course:courses(*), teacher:profiles(*)').order('created_at', { ascending: false });
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSection: { course_id: string; teacher_id: string | null; semester: string; schedule: string; capacity: number }) => {
      const { data, error } = await supabase.from('sections').insert([newSection]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['sections', variables.course_id] });
    },
  });
}
