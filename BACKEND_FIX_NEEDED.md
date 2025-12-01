# Backend Issue: citizenName is null in Comments

## Problem
The comments are being returned with `citizenName: null` even though the `citizenId` is present.

## Root Cause
Your Comment entity or CommentService in the backend is not fetching the citizen's name from the auth-service or user database.

## Backend Fix Required

### Option 1: Update Comment Entity (Recommended)
Add a transient field to fetch citizen name when loading comments:

```java
// In Comment entity
@Transient
private String citizenName;

public String getCitizenName() {
    if (citizenName == null && citizenId != null) {
        // Fetch from auth service or user repository
        // This is a placeholder - implement based on your architecture
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8081/api/users/" + citizenId;
            UserDTO user = restTemplate.getForObject(url, UserDTO.class);
            return user != null ? user.getFirstName() + " " + user.getLastName() : null;
        } catch (Exception e) {
            return null;
        }
    }
    return citizenName;
}
```

### Option 2: Update CommentService
Enrich comments with citizen names when fetching:

```java
@Service
public class CommentService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private CommentRepository commentRepository;
    
    private static final String AUTH_SERVICE_URL = "http://localhost:8081";
    
    public List<Comment> getCommentsByCampaign(Long campaignId) {
        List<Comment> comments = commentRepository.findByCampaignId(campaignId);
        
        // Enrich with citizen names
        for (Comment comment : comments) {
            try {
                String url = AUTH_SERVICE_URL + "/api/users/" + comment.getCitizenId();
                UserDTO user = restTemplate.getForObject(url, UserDTO.class);
                if (user != null) {
                    comment.setCitizenName(user.getFirstName() + " " + user.getLastName());
                }
            } catch (Exception e) {
                logger.warn("Failed to fetch user for citizenId: " + comment.getCitizenId());
                comment.setCitizenName("User #" + comment.getCitizenId());
            }
        }
        
        return comments;
    }
}
```

### Option 3: Use DTO Pattern
Create a CommentResponseDTO with citizenName:

```java
public class CommentResponseDTO {
    private Long commentId;
    private String content;
    private String publicationDate;
    private String lastModifiedDate;
    private Long campaignId;
    private Long citizenId;
    private String citizenName; // <- Populated from auth service
    
    // Constructor, getters, setters
}

// In service
public CommentResponseDTO toResponseDTO(Comment comment) {
    CommentResponseDTO dto = new CommentResponseDTO();
    // ... copy fields
    
    // Fetch citizen name
    try {
        UserDTO user = restTemplate.getForObject(
            AUTH_SERVICE_URL + "/api/users/" + comment.getCitizenId(), 
            UserDTO.class
        );
        dto.setCitizenName(user.getFirstName() + " " + user.getLastName());
    } catch (Exception e) {
        dto.setCitizenName("User #" + comment.getCitizenId());
    }
    
    return dto;
}
```

## Current Frontend Workaround

The frontend now handles missing citizenName gracefully by:
1. Checking for `citizenName` first
2. Falling back to `userName` if available
3. Finally showing "Citizen #[id]" if name is unavailable

This ensures the UI works even when citizenName is null.

## Testing After Backend Fix

1. Update your Comment entity or service as shown above
2. Restart campaign-service
3. Navigate to Dashboard → Comments
4. Comments should now show actual citizen names instead of "Citizen #2"

## Related Files
- Backend: `Comment.java`, `CommentService.java`
- Frontend: `comment.models.ts`, `association-dashboard.component.html`
