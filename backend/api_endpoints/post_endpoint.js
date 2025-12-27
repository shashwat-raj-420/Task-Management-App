import  express  from "express";
import  supabase  from "../supabase_setup/supabase_client.js";
import  classifyTask  from "../utils/classification.js";

const postRouter = express.Router();

// POST /api/tasks
postRouter.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            assigned_to,
            due_date,
            status = "pending"
        } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                error: "Title and description are required"
            });
        }
        
        const classification = classifyTask({ title, description });
        const { data: task, error } = await supabase
        .from("Tasks")
        .insert([
            {
                title,
                description,
                assigned_to,
                due_date,
                status,
                category: classification.category,
                priority: classification.priority,
                extracted_entities: classification.extracted_entities,
                suggested_actions: classification.suggested_actions,
                created_at: new Date(),
                updated_at: new Date()
            }
        ])
        .select()
        .single();
    
        if (error) throw error;
    
        // Audit log
        await supabase.from("task_history").insert([
            {
                task_id: task.id,
                action: "created",
                new_value: task,
                changed_at: new Date()
            }
        ]);
        return res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to create task"
        });
    }
});

export default postRouter;
