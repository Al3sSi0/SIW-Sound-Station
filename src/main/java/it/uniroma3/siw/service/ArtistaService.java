package it.uniroma3.siw.service;

import java.util.List;

import org.springframework.stereotype.Service;

import it.uniroma3.siw.model.Artista;
import it.uniroma3.siw.model.Brano;
import it.uniroma3.siw.repository.ArtistaRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@Service
public class ArtistaService {
	private ArtistaRepository artistaRepository;
	
	public ArtistaService(ArtistaRepository artistaRepository) {
		this.artistaRepository = artistaRepository;
	}

	public List<Artista> findAll() {
		return (List<Artista>) this.artistaRepository.findAll();
	}

	public Artista findById(Long id) {
		return this.artistaRepository.findById(id).get();
	}

	public void save(@Valid Artista artista) {
		this.artistaRepository.save(artista);
		
	}

	@Transactional
    public void delete(Artista artista) {
        if (artista.getBraniOspite() != null) {
            for (Brano brano : artista.getBraniOspite()) {
                brano.getFeaturing().remove(artista);
            }
        }
   
        this.artistaRepository.delete(artista);
    }
}
