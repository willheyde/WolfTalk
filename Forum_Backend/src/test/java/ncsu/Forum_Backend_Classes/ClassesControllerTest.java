//package ncsu.Forum_Backend_Classes;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//import org.springframework.http.ResponseEntity;
//
//import ncsu.Forum_Backend_Department.Department;
//import ncsu.Forum_Backend_Department.DepartmentRepository;
//
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class ClassesControllerTest {
//
//    @Mock
//    private ClassesRepository classCourseRepository;
//
//    @Mock
//    private DepartmentRepository majorRepository;
//
//    @InjectMocks
//    private ClassesController classesController;
//
//    private Classes sampleClass;
//    private Department sampleMajor;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//
//        sampleClass = new Classes();
//        sampleClass.setId(1L);
//        sampleClass.setCourseTitle("CSC116");
//        sampleClass.setChatEnabled(false);
//
//        sampleMajor = new Department();
//        sampleMajor.setId(100L);
//        sampleMajor.setName("Computer Science");
//        sampleMajor.setClassGroups(new ArrayList<>());
//    }
//
//    @Test
//    void testCreateClassWithoutMajor() {
//        when(classCourseRepository.save(any(Classes.class))).thenReturn(sampleClass);
//
//        ResponseEntity<Classes> response = classesController.createClass(sampleClass, null);
//
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals(sampleClass, response.getBody());
//        verify(classCourseRepository).save(sampleClass);
//    }
//
//    @Test
//    void testCreateClassWithValidMajor() {
//        when(majorRepository.findById(100L)).thenReturn(Optional.of(sampleMajor));
//        when(classCourseRepository.save(any(Classes.class))).thenReturn(sampleClass);
//        when(majorRepository.save(any(Department.class))).thenReturn(sampleMajor);
//
//        ResponseEntity<Classes> response = classesController.createClass(sampleClass, 100L);
//
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals(sampleClass, response.getBody());
//        assertTrue(sampleMajor.getClasses().contains(sampleClass));
//
//        verify(majorRepository).findById(100L);
//        verify(majorRepository).save(sampleMajor);
//        verify(classCourseRepository).save(sampleClass);
//    }
//
//    @Test
//    void testCreateClassWithInvalidMajor() {
//        when(majorRepository.findById(999L)).thenReturn(Optional.empty());
//
//        ResponseEntity<Classes> response = classesController.createClass(sampleClass, 999L);
//
//        assertEquals(400, response.getStatusCodeValue());
//        verify(classCourseRepository, never()).save(any());
//    }
//
//    @Test
//    void testGetClassByIdFound() {
//        when(classCourseRepository.findById(1L)).thenReturn(Optional.of(sampleClass));
//
//        ResponseEntity<Classes> response = classesController.getClassById(1L);
//
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals(sampleClass, response.getBody());
//    }
//
//    @Test
//    void testGetClassByIdNotFound() {
//        when(classCourseRepository.findById(2L)).thenReturn(Optional.empty());
//
//        ResponseEntity<Classes> response = classesController.getClassById(2L);
//
//        assertEquals(404, response.getStatusCodeValue());
//    }
//
////    @Test
////    void testGetAllClasses() {
////        List<Classes> list = List.of(sampleClass);
////        when(classCourseRepository.findAll()).thenReturn(list);
////
//////        List<Classes> result = classesController.getAllClasses();
////
////        assertEquals(1, result.size());
////        assertEquals(sampleClass, result.get(0));
////    }
//
//    @Test
//    void testSetChatEnabledFound() {
//        when(classCourseRepository.findById(1L)).thenReturn(Optional.of(sampleClass));
//        when(classCourseRepository.save(any())).thenAnswer(i -> i.getArgument(0));
//
//        ResponseEntity<Classes> response = classesController.setChatEnabled(1L, true);
//
//        assertEquals(200, response.getStatusCodeValue());
//        assertTrue(response.getBody().isChatEnabled());
//    }
//
//    @Test
//    void testSetChatEnabledNotFound() {
//        when(classCourseRepository.findById(1L)).thenReturn(Optional.empty());
//
//        ResponseEntity<Classes> response = classesController.setChatEnabled(1L, true);
//
//        assertEquals(404, response.getStatusCodeValue());
//    }
//}
