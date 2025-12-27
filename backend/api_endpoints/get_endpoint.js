import express from "express";
import supabase from "../supabase_setup/supabase_client.js";

const getRouter = express.Router();

/**
 * GET /api/tasks
 * List all tasks (filters + pagination + sorting)
 */
getRouter.get("/", async (req, res) => {
    try {
        const {
            status,
            category,
            priority,
            search,
            sort_by = "created_at",
            order = "desc"
        } = req.query;

        let query = supabase
        .from("Tasks") 
        .select("*", { count: "exact" });

        if (status) query = query.eq("status", status);
        if (category) query = query.eq("category", category);
        if (priority) query = query.eq("priority", priority);

        if (search) {
            query = query.or(
                `title.ilike.%${search}%,description.ilike.%${search}%`
            );
        }

        query = query.order(sort_by, { ascending: order === "asc" });

        const { data, error, count } = await query;

        if (error) throw error;

        res.status(200).json({
            success: true,
            total: count,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
});

/**
 * GET /api/tasks/status/:status
 */
getRouter.get("/status/:status", async (req, res) => {
    try {
        const { status } = req.params;

        const { data, error } = await supabase
        .from("Tasks")
        .select("*")
        .eq("status", status)
        .order("due_date", { ascending: true });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks by status",
            error: error.message
        });
    }
});

/**
 * GET /api/tasks/category/:category
 */
getRouter.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        
        const { data, error } = await supabase
        .from("Tasks")
        .select("*")
        .eq("category", category)
        .order("due_date", { ascending: true });
        
        if (error) throw error;
        
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks by category",
            error: error.message
        });
    }
});


/**
 * GET /api/tasks/priority/:priority
 */
getRouter.get("/priority/:priority", async (req, res) => {
    try {
        const { priority } = req.params;
        
        const { data, error } = await supabase
        .from("Tasks")
        .select("*")
        .eq("priority", priority)
        .neq("status", "completed")
        .order("due_date", { ascending: true });
        
        if (error) throw error;
        
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks by priority",
            error: error.message
        });
    }
});

/**
 * GET /api/tasks/:id
 * Get task with history
 */
getRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
        .from("Tasks")
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
        .eq("id", id)
        .single();
            
        if (error) throw error;
            
        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Task not found",
            error: error.message
        });
    }
});

export default getRouter;
