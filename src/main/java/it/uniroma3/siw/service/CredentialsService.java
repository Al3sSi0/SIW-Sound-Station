package it.uniroma3.siw.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.repository.CredentialsRepository;
import jakarta.transaction.Transactional;

@Service
public class CredentialsService {

    @Autowired
    private CredentialsRepository credentialsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    public Credentials getCredentials(Long id) { 
        return this.credentialsRepository.findById(id).orElse(null);
    }

    public Credentials getCredentials(String username) { 
        return this.credentialsRepository.findByUsername(username).orElse(null);
    }

    @Transactional
    public Credentials saveCredentials(Credentials credentials) { 
        
        credentials.setRole(Credentials.DEFAULT_ROLE); 
        
        credentials.setPassword(this.passwordEncoder.encode(credentials.getPassword())); 
        return this.credentialsRepository.save(credentials);
    }
}
