import supabase from "../supabase_setup/supabase_client";


export default async function getAllTasks() {
    try {
        const { data, error } = await supabase.from('Tasks').select('*').order('created_at',{ascending: false});
        if (error){
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching tasks:', err.message);
        return [];
    }
    
}

export async function getTasksByStatus(status) {
    try{
        const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', status)
        .order('due_date', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    } catch (error){
        console.error('Error fetching tasks:', err.message);
        return [];
    }
}

export async function getTasksByCategory(category) {
    try{
        const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('category', category)
        .order('due_date', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    } catch (error){
        console.error('Error fetching tasks:', err.message);
        return [];
    }
}

export async function getTasksByPriority(priority) {
    try{
        const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('priority', priority)
        .neq('status', 'completed')
        .order('due_date', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    } catch (error){
        console.error('Error fetching tasks:', err.message);
        return [];
    }
}

export async function getTaskWithHistory(taskId) {
    try {
        const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_history (
            id,
            action,
            old_value,
            new_value,
            changed_by,
            changed_at
          )
        `)
        .eq('id', taskId)
        .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching tasks:', err.message);
        return [];
    }
    
}