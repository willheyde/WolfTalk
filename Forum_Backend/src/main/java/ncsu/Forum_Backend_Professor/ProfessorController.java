package ncsu.Forum_Backend_Professor;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professors")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfessorController {

    @Autowired
    private ProfessorRepository professorRepo;

    // Get all professors
    @GetMapping
    public List<Professor> getAllProfessors() {
        return professorRepo.findAll();
    }

    // Get a specific professor by ID
    @GetMapping("/{id}")
    public Professor getProfessor(@PathVariable Long id) {
        return professorRepo.findById(id).orElseThrow();
    }

    // Add a new professor
    @PostMapping
    public Professor addProfessor(@RequestBody Professor professor) {
        return professorRepo.save(professor);
    }

    // Update professor
    @PutMapping("/{id}")
    public Professor updateProfessor(@PathVariable Long id, @RequestBody Professor updated) {
        Professor professor = professorRepo.findById(id).orElseThrow();
        professor.setName(updated.getName());
        professor.setEmail(updated.getEmail());
        professor.setDepartment(updated.getDepartment());
        return professorRepo.save(professor);
    }

    // Delete professor
    @DeleteMapping("/{id}")
    public void deleteProfessor(@PathVariable Long id) {
        professorRepo.deleteById(id);
    }
}

