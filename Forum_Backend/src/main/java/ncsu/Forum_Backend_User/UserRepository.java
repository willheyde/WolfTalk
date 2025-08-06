package ncsu.Forum_Backend_User;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * UserReposutory Interface, defines what spring connect should do, only added
 * finding user by their unityId, rest are provided.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    	User findByUnityId(String unityId);
    
}
