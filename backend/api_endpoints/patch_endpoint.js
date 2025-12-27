import express from "express";
import supabase from "../supabase_setup/supabase_client.js";

const patchRouter = express.Router();

patchRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        /* 1️⃣ Fetch existing task */
        const { data: oldTask, error: fetchError } = await supabase
        .from("Tasks")
        .select("*")
        .eq("id", id)
        .single();
        
        if (fetchError || !oldTask) {
            return res.status(404).json({ error: "Task not found" });
        }
      
        /* 2️⃣ Update task */
        const { data: updatedTask, error: updateError } = await supabase
        .from("Tasks")
        .update({
            ...updates,
            updated_at: new Date()
        })
        .eq("id", id)
        .select()
        .single();
        
        if (updateError) throw updateError;
        
        /* 3️⃣ Determine history action */
        let action = "updated";
        
        if (updates.status && updates.status !== oldTask.status) {
            action = "status_changed";
        }
      
        if (updates.status === "completed") {
            action = "completed";
        }
      
        /* 4️⃣ Log history */
        const { error: historyError } = await supabase
        .from("task_history")
        .insert({
            task_id: id,
            action,
            old_value: oldTask,
            new_value: updatedTask,
            changed_by: req.user?.email || "system",
            changed_at: new Date()
        });
        
        if (historyError) throw historyError;
        
        /* 5️⃣ Response */
        res.json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (err) {
        console.error("PATCH /api/tasks/:id error:", err);
        res.status(500).json({ error: "Failed to update task" });
    }
});

export default patchRouter;
