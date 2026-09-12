package it.uniroma3.siw.authentication;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component // <-- QUESTA è l'annotazione che permetterà a Spring di trovarlo!
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    @Lazy
    private UserDetailsService userDetailsService; 
    
    private final String SECRET_KEY = "LaTuaChiaveSegretaMoltoLungaEConfidenzialePerILogInMusicSite"; 

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

      
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
              
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(SECRET_KEY.getBytes())
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();
                
                username = claims.getSubject(); 
            } catch (Exception e) {
                logger.warn("Token JWT non valido, scaduto o contraffatto: " + e.getMessage());
            }
        }

       
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
         
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authenticationToken = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
           
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        
    
        chain.doFilter(request, response);
    }
}