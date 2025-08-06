package ncsu.Forum_Backend_User;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import java.util.Enumeration;


@RestController
public class AuthBridgeController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/auth-bridge")
    public RedirectView handleAuthBridge(
            HttpServletRequest request,
            @RequestParam(value = "target", required = false, defaultValue = "/") String target
    ) {
        // Read Shibboleth headers
        String unityId = request.getHeader("X-Shib-Eptid");
     
        Enumeration<String> names = request.getHeaderNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            System.out.println();
            System.out.println();
            System.out.println();
            System.out.printf("Incoming header: %s = %s%n", name, request.getHeader(name));

        }
        // Validate UID is present
        if (unityId == null || unityId.isEmpty()) {
            // Log warning or throw error
            return new RedirectView("/error");
        }

        // Find or create the user
        User user = userRepository.findByUnityId(unityId);
        if (user == null) {
             user = new User(unityId, null, null, null, null, false);
             userRepository.save(user);
        }
        // Store in session if needed (optional)
        request.getSession().setAttribute("currentUser", user);

        // Redirect to original target
        return new RedirectView(target);
    }
}
