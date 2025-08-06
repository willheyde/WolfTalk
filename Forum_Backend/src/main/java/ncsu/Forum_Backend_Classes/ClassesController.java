package ncsu.Forum_Backend_Classes;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ncsu.Forum_Backend_Department.Department;
import ncsu.Forum_Backend_Department.DepartmentRepository;
import ncsu.Forum_Backend_Professor.Professor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/classes")
public class ClassesController {

    private final ClassesRepository classCourseRepository;
    private final DepartmentRepository majorRepository;

    public ClassesController(ClassesRepository classCourseRepository, DepartmentRepository majorRepository) {
        this.classCourseRepository = classCourseRepository;
        this.majorRepository = majorRepository;
    }

    // Create a new class and optionally assign to a major
    @PostMapping
    public ResponseEntity<Classes> createClass(@RequestBody Classes classCourse,
                                                   @RequestParam(required = false) Long majorId) {
        if (majorId != null) {
            Optional<Department> majorOpt = majorRepository.findById(majorId);
            if (majorOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Department major = majorOpt.get();
            major.getClasses().add(classCourse);
            majorRepository.save(major); // Save major to update relation
            classCourse.setDepartment(major);
        }

        Classes saved = classCourseRepository.save(classCourse);
        return ResponseEntity.ok(saved);
    }

    // Get a class by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Classes> getClassById(@PathVariable Long id) {
        return classCourseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

//    // Get all classes
//    @GetMapping
//    public ResponseEntity<List<Classes>> getAllClasses() {
//        List<Classes> result = classCourseRepository.findAll();
//        return ResponseEntity.ok(result);
//    }
//    
//    @GetMapping("/department/{classTitle}")
//    public ResponseEntity<List<Professor>> getProfessorsByCourseTitle(@PathVariable String title) {
//    	List<Professor> result = classCourseRepository.findByCourseTitle(title).get().getProfessors(); 
//    	return ResponseEntity.ok(result);
//    }

    // Enable or disable chat
    @PutMapping("/{id}/chat")
    public ResponseEntity<Classes> setChatEnabled(@PathVariable Long id, @RequestParam boolean enabled) {
        Optional<Classes> opt = classCourseRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Classes c = opt.get();
        c.setChatEnabled(enabled);
        return ResponseEntity.ok(classCourseRepository.save(c));
    }
 // Add these methods to your ClassesController

 // Search classes
 @GetMapping("/search")
 public ResponseEntity<List<Classes>> searchClasses(@RequestParam String q) {
     // You'll need to add a search method to your repository
     List<Classes> results = classCourseRepository.findByCourseTitleContainingIgnoreCase(q);
     return ResponseEntity.ok(results);
 }

 // Get classes by department
 @GetMapping("/department/{departmentId}")
 public ResponseEntity<Set<Classes>> getClassesByDepartment(@PathVariable Long departmentId) {
     Optional<Department> dept = majorRepository.findById(departmentId);
     if (dept.isEmpty()) {
         return ResponseEntity.notFound().build();
     }
     return ResponseEntity.ok(dept.get().getClasses());
 }

 // Get popular classes (placeholder - you'll need to implement logic)
 @GetMapping("/popular")
 public ResponseEntity<List<Classes>> getPopularClasses(@RequestParam(defaultValue = "20") int limit) {
     // For now, just return all classes limited by the parameter
     List<Classes> allClasses = classCourseRepository.findAll();
     return ResponseEntity.ok(allClasses.stream()
             .limit(limit)
             .collect(Collectors.toList()));
 }

 // Follow a class (placeholder - needs user authentication)
 @PostMapping("/{id}/follow")
 public ResponseEntity<Void> followClass(@PathVariable Long id) {
     // You'll need to implement user authentication and a follow relationship
     // For now, just check if the class exists
     if (!classCourseRepository.existsById(id)) {
         return ResponseEntity.notFound().build();
     }
     return ResponseEntity.ok().build();
 }
    // Future: Enable or disable call (you'll need a field like `callEnabled`)
    // @PutMapping("/{id}/call")
    // public ResponseEntity<ClassCourse> setCallEnabled(@PathVariable Long id, @RequestParam boolean enabled) { ... }
}
