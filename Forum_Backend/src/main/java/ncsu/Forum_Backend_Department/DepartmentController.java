
package ncsu.Forum_Backend_Department;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ncsu.Forum_Backend_Classes.Classes;
import ncsu.Forum_Backend_Professor.Professor;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    // GET /api/departments
    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // GET /api/departments/{id} including classes and professors
    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentWithRelations(@PathVariable Long id) {
        Optional<Department> opt = departmentRepository.findAllRelationsById(id);
        return opt.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // POST, PUT, DELETE unchanged...
    @PostMapping
    public Department createDepartment(@RequestBody Department department) {
        return departmentRepository.save(department);
    }

    @PutMapping("/{id}")
    public Department updateDepartment(@PathVariable Long id, @RequestBody Department updatedDepartment) {
        return departmentRepository.findById(id).map(dept -> {
            dept.setName(updatedDepartment.getName());
            dept.setCode(updatedDepartment.getCode());
            return departmentRepository.save(dept);
        }).orElseGet(() -> {
            updatedDepartment.setId(id);
            return departmentRepository.save(updatedDepartment);
        });
    }

    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable Long id) {
        departmentRepository.deleteById(id);
    }
    @GetMapping("/specificId/{name}")
    public ResponseEntity<Department> getDepartmentByName(@PathVariable String name){
    	 Optional<Department> opt = departmentRepository.findByName(name);
    	 return opt.map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
    }
}