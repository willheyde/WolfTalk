//package ncsu.Forum_Backend_Message;
//
//import ncsu.Forum_Backend_User.User;
//import ncsu.Forum_Backend_User.UserRepository;
//import ncsu.Forum_Backend_Classes.Classes;
//import ncsu.Forum_Backend_Classes.ClassesRepository;
//import ncsu.Forum_Backend_Department.Department;
//import ncsu.Forum_Backend_Department.DepartmentRepository;
//import ncsu.Forum_Backend_User.GroupChat;
//import ncsu.Forum_Backend_User.GroupChatRepository;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//import org.springframework.http.ResponseEntity;
//
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class MessageControllerTest {
//
//    @Mock
//    private MessageRepository messageRepository;
//
//    @Mock
//    private UserRepository userRepository;
//
//    @Mock
//    private ClassesRepository classesRepository;
//
//    @Mock
//    private DepartmentRepository majorRepository;
//
//    @Mock
//    private GroupChatRepository groupChatRepository;
//
//    @InjectMocks
//    private MessageController messageController;
//
//    private Message sampleMessage;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//
//        sampleMessage = new ClassMessage();
//        sampleMessage.setId(1L);
//        sampleMessage.setContent("Test content");
//    }
//
//    @Test
//    void testPostClassMessageSuccess() {
//        User sender = new User();
//        sender.setId(1L);
//
//        Classes cls = new Classes();
//        cls.setId(2L);
//
//        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
//        when(classesRepository.findById(2L)).thenReturn(Optional.of(cls));
//        when(messageRepository.save(any(Message.class))).thenReturn(sampleMessage);
//
//        ResponseEntity<Message> response = messageController.postClassMessage(sampleMessage, 1L, 2L);
//
//        assertEquals(201, response.getStatusCodeValue());
//        assertEquals(sampleMessage, response.getBody());
//    }
//
//    @Test
//    void testPostClassMessageUserNotFound() {
//        when(userRepository.findById(1L)).thenReturn(Optional.empty());
//
//        ResponseEntity<Message> response = messageController.postClassMessage(sampleMessage, 1L, 2L);
//
//        assertEquals(404, response.getStatusCodeValue());
//    }
//
////    @Test
////    void testGetMessagesByClass() {
////        List<ClassMessage> messages = List.of(sampleMessage);
////        when(messageRepository.findByClassId(1L)).thenReturn(messages);
////
////        List<ClassMessage> result = messageController.getMessagesByClass(1L).getBody();
////
////        assertEquals(1, result.size());
////    }
////
////    @Test
////    void testGetMessagesByMajor() {
////        List<MajorMessage> messages = List.of(sampleMessage);
////        when(messageRepository.findByMajorId(1L)).thenReturn(messages);
////
////        List<MajorMessage> result =  messageController.getMessagesByMajor(1L).getBody();
////
////        assertEquals(1, result.size());
////    }
////
////    @Test
////    void testGetMessagesByGroup() {
////        List<MajorMessage> messages = List.of(sampleMessage);
////        when(messageRepository.findByGroupId(1L)).thenReturn(messages);
////
////        List<MajorMessage> result = messageController.getMessagesByGroup(1L).getBody();
////
////        assertEquals(1, result.size());
////    }
////
////    @Test
////    void testGetDirectMessages() {
////        List<DirectMessage> messages = List.of(sampleMessage);
////        when(messageRepository.findDirectMessages(1L, 2L)).thenReturn(messages);
////
////        List<DirectMessage> result =  messageController.getDirectMessages(1L, 2L).getBody();
////
////        assertEquals(1, result.size());
////    }
//
//    @Test
//    void testGetMessageByIdFound() {
//        when(messageRepository.findById(1L)).thenReturn(Optional.of(sampleMessage));
//
//        ResponseEntity<Message> response = messageController.getMessageById(1L);
//
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals(sampleMessage, response.getBody());
//    }
//
//    @Test
//    void testGetMessageByIdNotFound() {
//        when(messageRepository.findById(99L)).thenReturn(Optional.empty());
//
//        ResponseEntity<Message> response = messageController.getMessageById(99L);
//
//        assertEquals(404, response.getStatusCodeValue());
//    }
//
////    @Test
////    void testDeleteMessageFound() {
////        when(messageRepository.existsById(1L)).thenReturn(true);
////        doNothing().when(messageRepository).deleteById(1L);
////
////        ResponseEntity<Void> response = messageController.deleteMessage(1L);
////
////        assertEquals(204, response.getStatusCodeValue());
////    }
////
////    @Test
////    void testDeleteMessageNotFound() {
////        when(messageRepository.existsById(999L)).thenReturn(false);
////
////        ResponseEntity<Void> response = messageController.deleteMessage(999L);
////
////        assertEquals(404, response.getStatusCodeValue());
////    }
//}
