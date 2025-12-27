import express from "express";
import supabase from "../supabase_setup/supabase_client.js";

const deleteRouter = express.Router();

deleteRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
        .from("Tasks")
        .delete()
        .eq("id", id);
        
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete task",
                error: error.message,
            });
        }
      
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

export default deleteRouter;
